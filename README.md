# KidsTown-Conversion-Project

A conversion of the original **KidsTown** Perl/CGI children's website
(`kidstown_cgi-main/`) into a modern, purely client-side single-page
application (`site/`). The converted site runs entirely in the browser —
no CGI, no Perl, and no remote image URLs — while preserving the
original text, images, choices, feedback, and navigation for every
converted location.

## Locations

All eight locations on the original KidsTown map have been converted:

- **City Park** — an interactive "Big Journey" story with branching choices.
- **Museum** — weather and space exhibits and activities.
- **Toy Store** — riddles, shape poems, and a bonus problem puzzle.
- **Zoo** — four animal regions plus the Zoo Keeper's Challenge quizzes.
- **City Hall** — branching detective stories (including the Bungled Bank
  Burglary) and a shape-matching game.
- **School** — Word Fun, Scramble, and a full Farm Field Trip.
- **Township** — the four Wonders of the World quizzes and the Country
  Shape Matching Game.
- **Library** — the clickable U.S. map, all seven regional maps, Alaska
  and Hawaii, individual pages for all 50 states plus Washington, D.C.,
  and every linked activity (word searches, Wacky Web Tales, and
  fill-in quizzes).

## Previewing locally

The site is static HTML/CSS/JS, so any local web server works. In VS Code:

1. Install the **Live Preview** extension (Microsoft), if not already installed.
2. Open this folder in VS Code.
3. Right-click [site/index.html](site/index.html) in the Explorer and choose
   **Show Preview**, or open the file and click the Live Preview icon in
   the editor toolbar.
4. Live Preview starts a local server and opens the site at its root
   (`#/home`); use the map on the home page to navigate to each location.

## Deployment

[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
defines the CI/CD pipeline:

- On every push or pull request targeting `main`, a `validate` job checks
  that the required SPA files exist (`site/index.html`, `site/styles.css`,
  `site/app.js`, `site/assets/images/hometown.gif`) and that the home page
  links to all eight location routes (`#/township`, `#/museum`, `#/zoo`,
  `#/school`, `#/city-hall`, `#/toy-store`, `#/city-park`, `#/library`).
- On pushes to `main` only (not on pull requests), the workflow then
  uploads the `site/` directory as a Pages artifact and deploys it to
  GitHub Pages using the standard `actions/configure-pages`,
  `actions/upload-pages-artifact`, and `actions/deploy-pages` actions.

The live deployment is at:

**https://milesporter91.github.io/KidsTown-Conversion-Project/**

Note: GitHub Pages always serves whatever is currently on `main`. The
full eight-location conversion described above lives on the
`convert-kidstown-locations` branch; the deployed site will reflect it
once that branch is merged into `main`.
