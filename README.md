# KidsTown-Conversion-Project

KidsTown was a Perl/CGI children's literacy website built in 1998 by
University of Colorado at Denver students, in partnership with the
Tattered Cover Book Store, as part of the Children's Literacy Project
(see `kidstown_cgi-main/README.md` for that history). This repository
holds the original CGI source (`kidstown_cgi-main/`) and a static,
client-side conversion of it (`site/`) that runs entirely in the
browser — no CGI, no Perl, no server-side includes, and no remote image
URLs. Every image, page of text, quiz, and story choice in `site/` was
copied or reproduced from the original scripts and data files under
`kidstown_cgi-main/`.

## Original site vs. converted site

- **Original KidsTown (still live, PHP-based today):**
  https://jodypaul.com/kidstown/ — this is the same project the source
  in `kidstown_cgi-main/` came from. The `kt.ini` config in this repo
  (`kidstown_cgi-main/cgi-bin/kt.ini`) points at `kidstown.mine.nu`,
  which now redirects to `jodypaul.com/kidstown/`; the maintainer has
  since ported the CGI engine to PHP (`kt.php` instead of `kt.cgi`), but
  the content and navigation match what's in `kidstown_cgi-main/`.
- **Converted site (this repository, GitHub Pages):**
  https://milesporter91.github.io/KidsTown-Conversion-Project/ — built
  from the `site/` folder by `.github/workflows/deploy-pages.yml` on
  every push to `main` (see "Validation and deployment" below).

## Repository layout

- `kidstown_cgi-main/` — the original Perl/CGI source: `scripts/`
  (one folder per location), `data/` (the flat-file records the scripts
  read), `graphics/` (original images), and `cgi-bin/kt.db` /
  `cgi-bin/kt.ini` (the route table and server config the CGI engine
  used to dispatch requests). Nothing here runs as part of the
  converted site; it's kept as the reference source.
- `site/` — the converted static SPA. This is the folder GitHub Pages
  deploys.
- `scripts/check-site.js` — a maintenance script for this repo (not
  part of the deployed site); see "Validation and deployment" below.
- `.github/workflows/deploy-pages.yml` — the CI/CD workflow.
- `KidsTown-project.zip` — a zipped copy of `kidstown_cgi-main/`. It
  isn't read by the site, the workflow, or `scripts/check-site.js`.

## Setup and preview steps

The site is plain HTML/CSS/JS with no build step, no bundler, and no
`package.json` — there is nothing to install to view it.

1. Clone the repository and open the folder in VS Code.
2. Install the **Live Preview** extension (publisher: Microsoft) from
   the Extensions panel, if you don't already have it.
3. In the Explorer, right-click `site/index.html` and choose
   **Show Preview** (or open the file and click the Live Preview icon
   in the editor's top-right corner).
4. Live Preview starts a local server and opens the site at `#/home`.
   Click a location on the map, or edit the address bar's hash directly
   to jump to one, e.g. `#/library` or `#/township` (see the route list
   below for all eight).

`scripts/check-site.js` additionally needs Node.js — any reasonably
recent version should work locally (it was last run here on Node 24),
though CI runs it on Node 20 specifically (see "Validation and
deployment" below). Node is only needed for running that script, not
for viewing the site itself.

## The eight location modules

Every location is one self-contained script loaded by `site/index.html`
and one `<section id="X-view"><div id="X-content"></div></section>` in
that same file. `site/app.js` only ever calls that module's `start()`
method; everything else about how a location renders itself is private
to its own file.

| Location | Route | Module file | `window` export | Assets | Content |
|---|---|---|---|---|---|
| City Park | `#/city-park` | `site/citypark.js` | `CityPark` | `assets/images/citypark/` | A branching "Big Journey" story (`PAGES` object), driven by `kidstown_cgi-main/data/citypark/page1`-`page18`. |
| Museum | `#/museum` | `site/museum.js` | `Museum` | `assets/images/museum/` | Two exhibits: "The Color Exhibition" (`COLOR_PAGES`) and a planet quiz (`QUIZ_DECKS`). |
| Toy Store | `#/toy-store` | `site/toystore.js` | `ToyStore` | `assets/images/toystore/` | Riddles (`RIDDLES`), Shape Poems (`SHAPE_POEMS`), and a bonus problem. |
| Zoo | `#/zoo` | `site/zoo.js` | `Zoo` | `assets/images/zoo/` | World map plus four animal regions (`REGIONS`: ocean, africa, australia, polar), each with a Zoo Keeper's Challenge quiz. |
| City Hall | `#/city-hall` | `site/cityhall.js` | `CityHall` | `assets/images/cityhall/` | Two branching detective stories as node graphs: `BBB_NODES` ("The Bungled Bank Burglary") and `CAP_NODES` ("The Case of the Alien Photo"). |
| School | `#/school` | `site/school.js` | `School` | `assets/images/school/` | Word Fun and Scramble (both read `WORD_LEVELS`, sourced from `kidstown_cgi-main/data/school/e_data1-3.txt`), plus the Farm Field-Trip (`ANIMALS`, `PLANTS`). |
| Township | `#/township` | `site/township.js` | `Township` | `assets/images/township/` | Four Wonders-of-the-World quizzes (`WONDERS`) and the Country Shape Matching Game (`ROUNDS`, `COUNTRIES`). |
| Library | `#/library` | `site/library.js` | `Library` | `assets/images/library/` | The clickable U.S. map, 7 regions (`REGIONS`), all 51 state/D.C. records (`STATES`), and the 8 linked activities (`WORDSEARCH`, `TALE_FORMS`, `FILLIN_FORMS`/`FILLIN_SOLUTIONS`). |

## How routing works

`site/app.js` is the only router. `handleRoute()` reads
`window.location.hash` and compares it against nine literal strings:
`#/home` and the eight `#/<location>` routes in the table above. Each
match calls a `showX()` function that hides every other `<section>`,
un-hides that location's section, and — for the eight locations — calls
`window.<Export>.start()` so the module renders its own entrance screen
into its `<div id="X-content">`.

Two things worth knowing before you touch this file:

- There's also a generic `locations` object and a `#location-view`
  section with `showLocation()`, left over from before the eight
  modules existed (it used to hold "still being converted" placeholder
  text for each location). `locations` is empty now — nothing
  populates it — but the code path is still live: any hash that isn't
  one of the nine handled routes falls through to it and renders
  "Location Not Found." If you add a ninth route, add it as its own
  `if (route === "#/...")` branch the same way the existing eight are
  written, rather than adding to `locations`.
- Once you're inside a location, moving between its own screens (story
  pages, quiz results, state pages, activity forms) never changes
  `window.location.hash`. Each module keeps its own render state
  in-memory and swaps the contents of its one content `<div>` directly.
  The hash only changes when a screen has an actual
  `<a href="#/home">` link (rendered as "Return to the KidsTown map" in
  every location) or when the visitor picks a different spot on the
  home map.

## How assets work

Each module declares its own base path near the top of the file, for
example (from `site/library.js`):

```js
var ASSET_PATH = "assets/images/library/";
```

Every image in that module is built as `ASSET_PATH + "<filename>"`.
These paths are relative — no leading slash — which is why the same
`site/` folder works both from Live Preview (served at its own root)
and from GitHub Pages (served under `/KidsTown-Conversion-Project/`)
without any per-environment configuration.

The image files themselves are plain copies of the matching files
under `kidstown_cgi-main/graphics/<location>/`, moved into
`site/assets/images/<location>/` — nothing is resized, recompressed, or
renamed as part of the conversion, except where the original had a
case mismatch between what a script referenced and what the file was
actually named on disk (that happened once, in Township — see "Known
limitations").

Filenames must match **exactly**, including case. Windows and macOS
filesystems are case-insensitive by default, so a typo like
`Turkey.gif` vs. `turkey.gif` can look fine in Live Preview and still
404 once deployed, because GitHub Pages serves from a case-sensitive
Linux filesystem. `scripts/check-site.js` (below) checks this
specifically.

## How to change an activity

1. Open the module file for that location from the table above.
2. Find the data structure that holds the content — the table above
   names the main ones per location (`WONDERS`, `STATES`,
   `WORD_LEVELS`, and so on). These are plain JavaScript object
   literals and arrays, not templates — the rendering code just reads
   whatever is in them.
3. Edit the text, choices, correct answers, or image filenames directly
   in that object.
4. If you reference a new image, copy it into
   `site/assets/images/<location>/` using the exact filename and case
   you wrote in the code.
5. Run `node scripts/check-site.js` from the repo root to catch a
   missing/mis-cased asset or a route typo before you preview. CI runs
   this same script on every pull request, so this step just saves you
   a round-trip through GitHub Actions.
6. Open the location in Live Preview and click through the activity by
   hand. There's no automated test that exercises on-screen content or
   game logic (see "Known limitations") — this manual pass is currently
   the only way to catch a broken quiz or a story branch that doesn't
   render.

Two concrete examples:

**Changing a quiz question and answer** — Township's Statue of Zeus
quiz, in `site/township.js`:

```js
q1: {
  label: "The statue of Zeus was built around the year",
  options: ["500 CE", "300 BCE", "420 BC"],
  correct: "420 BC"
},
```

The grading code compares the visitor's selection to `correct` with a
plain `===`, so `correct` has to be one of the exact strings in
`options` — not a different value that "means" the same thing. This is
not a hypothetical: Library's Washington D.C. fill-in quiz had a real
bug where the answer key for question 4 was
`"Capital - many of these"` while the selectable option was `"Capital"`
— they never matched, so that question could never be marked correct.
It's fixed now (`FILLIN_SOLUTIONS.dc.sols[3]` in `site/library.js`), but
it's the exact mistake to watch for whenever you touch a `FILLIN_FORMS`
question and its matching `FILLIN_SOLUTIONS` entry, or any other
quiz's `options` and `correct` pair, in this codebase.

**Changing plain content** — Library's Alaska word search sentences, in
`site/library.js` (`WORDSEARCH.ak.sentences`): these strings are only
ever displayed, never compared against anything in code, so you can
reword them freely. The actual answer words live inside the puzzle
image itself (`ws_ak.gif` / `ws_ak_ans.gif`), not in this array.

## Validation and deployment

`.github/workflows/deploy-pages.yml` runs on every push or pull request
to `main`, plus manual dispatch. It has three jobs:

- **`validate`** runs four steps, in order:
  1. Confirms four files exist: `site/index.html`, `site/styles.css`,
     `site/app.js`, `site/assets/images/hometown.gif`.
  2. Confirms `site/index.html` contains an `href="#/<route>"` for each
     of the eight location routes.
  3. Sets up Node.js (`actions/setup-node@v4`, version 20).
  4. Runs `node scripts/check-site.js` — see below.
- **`upload`** and **`deploy`** run only on pushes to `main` (skipped on
  pull requests, and skipped entirely if `validate` fails): they package
  the `site/` folder with `actions/upload-pages-artifact` and publish it
  with `actions/deploy-pages`.

A pull request that breaks a route or a referenced asset now fails CI
before it can be merged, the same way a missing required file already
did.

**`scripts/check-site.js`** is the step that actually checks routing and
assets — steps 1-2 above only check that `index.html` mentions the right
strings, not that `app.js` or the asset folders back them up. It:

- Confirms every `#/...` hash referenced anywhere — the home page's map,
  or any "Return to the KidsTown map" link inside a location module —
  has a matching handled branch in `app.js`. A route that's referenced
  but not handled would silently fall through to "Location Not Found."
- Confirms every image filename referenced in a location module exists
  in that module's asset folder, compared case-sensitively (see "How
  assets work").

Run it locally from the repo root the same way CI invokes it:

```
node scripts/check-site.js
```

It only reads files and prints a report; it exits with status 1 if it
finds a problem. As of this writing it passes cleanly when run locally
(verified on Node 24: 9 routes and 344 referenced image paths checked,
zero errors). The CI job pins Node 20 for this step; that exact version
hasn't been exercised by an actual GitHub Actions run yet, so the next
push or pull request will be the first real confirmation of the CI
step itself.

## Known limitations

- **No automated UI or content tests.** `scripts/check-site.js` checks
  routing wiring and asset existence, not that a given screen renders
  correctly or that a quiz grades the way it's supposed to. Verifying
  actual behavior (a story branch, a quiz's right/wrong feedback) has
  so far been done by hand in a browser, not captured as a repeatable
  test.
- **`app.js`'s `locations` object and `#location-view` are vestigial.**
  They still work (see "How routing works") but nothing populates them;
  they predate the eight real modules.
- **A few gaps and orphans in the original CGI source were found during
  conversion and were deliberately not "fixed" or invented around**,
  since the goal was a faithful port, not a redesign. Each is
  documented in a comment at the top of the relevant file:
  - `site/cityhall.js`: `bbb3-3.pl` (original KEY 5040) is registered in
    `kt.db` but nothing else in the original ever links to it; it's
    left unreachable here too.
  - `site/school.js`: the original's plant routes skip KEY 4543 —
    seven plants, not eight, is a gap in the source data, not a bug
    introduced here.
  - `site/township.js`: `mainwonders.pl` (KEY 3100) is likewise
    registered but unlinked in the original; also, `graphics/township/`
    contains unused Hanging Gardens of Babylon and Mausoleum at
    Halicarnassus artwork with no matching script or route in the
    original, so neither was added as a fifth/sixth Wonder.
  - `site/library.js`: the original state data file defines `FLAG_IMG`,
    `BACKGROUND`, `TEXTCOLOR`, and `LINE` fields that its own
    `statepage.pl` never read; they're carried over as unused data here
    too, for the same reason.
- **No linting, formatting, or dependency management.** There's no
  `package.json` by design (no build step to support), which also means
  there's currently nothing enforcing a consistent code style across
  the eight modules beyond following the existing pattern by hand.
