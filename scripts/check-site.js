#!/usr/bin/env node
/*
 * Focused maintenance checks for the KidsTown SPA in site/.
 *
 * Run from the repo root with:
 *   node scripts/check-site.js
 *
 * Checks performed (see README.md "Validation and deployment" for context):
 *
 *   1. Broken routes - every "#/..." hash referenced from site/index.html
 *      (the home map's <area> links, the header logo link) or from any
 *      of the eight location modules (their "Return to the KidsTown map"
 *      links) must have a matching `route === "#/..."` branch in
 *      site/app.js's handleRoute(). A hash that's referenced but not
 *      handled falls through to the generic "Location Not Found" screen
 *      at runtime instead of the intended view.
 *
 *   2. Missing or mis-cased assets - every image filename referenced in
 *      a location module is resolved against that module's own
 *      `ASSET_PATH` constant and checked against the real files in
 *      site/assets/images/<location>/. The comparison is case-sensitive
 *      even on Windows/macOS, because GitHub Pages serves from a
 *      case-sensitive Linux filesystem - a reference that only "works"
 *      locally because the OS ignores case would 404 once deployed.
 *
 * This script only reads files; it never writes anything. It exits with
 * status 1 if any check fails, so it can be wired into CI later if the
 * team wants to.
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");
const SITE_DIR = path.join(REPO_ROOT, "site");

const LOCATION_MODULES = [
  "citypark.js",
  "museum.js",
  "toystore.js",
  "zoo.js",
  "cityhall.js",
  "school.js",
  "township.js",
  "library.js"
];

const IMAGE_EXTENSION_RE = /"([A-Za-z0-9_.~-]+\.(?:gif|GIF|jpg|JPG|jpeg|JPEG|png|PNG))"/g;
const ASSET_PATH_RE = /var ASSET_PATH = "assets\/images\/([a-z]+)\/";/;
const ROUTE_HANDLED_RE = /route === "(#\/[a-z0-9-]+)"/g;
const ROUTE_REFERENCED_RE = /["'](#\/[a-z0-9-]+)["']/g;

const errors = [];
const warnings = [];

function readSiteFile(relativePath) {
  return fs.readFileSync(path.join(SITE_DIR, relativePath), "utf8");
}

// ---------------------------------------------------------------------
// Check 1: broken routes
// ---------------------------------------------------------------------

function checkRoutes() {
  const appJs = readSiteFile("app.js");
  const handledRoutes = new Set();
  for (const match of appJs.matchAll(ROUTE_HANDLED_RE)) {
    handledRoutes.add(match[1]);
  }

  const referencedRoutes = new Map(); // route -> Set of file names that reference it

  function collectFrom(text, sourceName) {
    for (const match of text.matchAll(ROUTE_REFERENCED_RE)) {
      const route = match[1];
      if (!referencedRoutes.has(route)) {
        referencedRoutes.set(route, new Set());
      }
      referencedRoutes.get(route).add(sourceName);
    }
  }

  collectFrom(readSiteFile("index.html"), "index.html");
  for (const file of LOCATION_MODULES) {
    collectFrom(readSiteFile(file), file);
  }

  for (const [route, sources] of referencedRoutes) {
    if (!handledRoutes.has(route)) {
      errors.push(
        `Broken route: "${route}" is referenced from ${[...sources].sort().join(", ")} ` +
        `but site/app.js's handleRoute() has no branch for it.`
      );
    }
  }

  const unreferenced = [...handledRoutes].filter((route) => !referencedRoutes.has(route));
  if (unreferenced.length) {
    warnings.push(
      `Route(s) handled in app.js but not linked from index.html or any location module: ${unreferenced.join(", ")}`
    );
  }

  return { handledCount: handledRoutes.size, referencedCount: referencedRoutes.size };
}

// ---------------------------------------------------------------------
// Check 2: missing or mis-cased assets
// ---------------------------------------------------------------------

function checkAssets() {
  let filesChecked = 0;

  // The home page's own image, outside any location module.
  const indexHtml = readSiteFile("index.html");
  const homeImageMatch = indexHtml.match(/src="(assets\/images\/[A-Za-z0-9_.~-]+)"/);
  if (homeImageMatch) {
    filesChecked += 1;
    const fullPath = path.join(SITE_DIR, homeImageMatch[1]);
    const dir = path.dirname(fullPath);
    const base = path.basename(fullPath);
    const realFiles = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    if (!realFiles.includes(base)) {
      errors.push(`Missing asset: index.html references "${homeImageMatch[1]}", which does not exist.`);
    }
  } else {
    warnings.push("Could not find the home page's own image reference in index.html to check.");
  }

  for (const file of LOCATION_MODULES) {
    const source = readSiteFile(file);
    const assetPathMatch = source.match(ASSET_PATH_RE);
    if (!assetPathMatch) {
      warnings.push(`${file}: no ASSET_PATH constant found in the expected form; skipped asset check for this file.`);
      continue;
    }
    const slug = assetPathMatch[1];
    const imageDir = path.join(SITE_DIR, "assets", "images", slug);
    const realFiles = fs.existsSync(imageDir) ? fs.readdirSync(imageDir) : null;
    if (realFiles === null) {
      errors.push(`Missing directory: ${file} expects site/assets/images/${slug}/, which does not exist.`);
      continue;
    }

    const referenced = new Set();
    for (const match of source.matchAll(IMAGE_EXTENSION_RE)) {
      referenced.add(match[1]);
    }

    for (const filename of referenced) {
      filesChecked += 1;
      if (!realFiles.includes(filename)) {
        // Distinguish "missing entirely" from "exists under a different case",
        // since the second one only breaks on a case-sensitive host.
        const caseInsensitiveMatch = realFiles.find(
          (f) => f.toLowerCase() === filename.toLowerCase()
        );
        if (caseInsensitiveMatch) {
          errors.push(
            `Case mismatch: ${file} references "${filename}", but the file on disk is ` +
            `"${caseInsensitiveMatch}" (site/assets/images/${slug}/). This can pass locally on ` +
            `Windows/macOS and still 404 on GitHub Pages.`
          );
        } else {
          errors.push(
            `Missing asset: ${file} references "${filename}", which does not exist in ` +
            `site/assets/images/${slug}/.`
          );
        }
      }
    }
  }

  return { filesChecked };
}

// ---------------------------------------------------------------------

const routeStats = checkRoutes();
const assetStats = checkAssets();

console.log(`Checked ${routeStats.referencedCount} referenced route(s) against ${routeStats.handledCount} handled route(s) in app.js.`);
console.log(`Checked ${assetStats.filesChecked} referenced image path(s) against site/assets/images/.`);
console.log("");

if (warnings.length) {
  console.log(`${warnings.length} warning(s):`);
  for (const w of warnings) {
    console.log(`  - ${w}`);
  }
  console.log("");
}

if (errors.length) {
  console.log(`${errors.length} error(s):`);
  for (const e of errors) {
    console.log(`  - ${e}`);
  }
  process.exit(1);
}

console.log("No broken routes or missing/mis-cased assets found.");
