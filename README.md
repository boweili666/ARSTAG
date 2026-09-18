# ARSTAG project website

Project page for **ARSTAG: An Agentic Real2Sim2Real System for Task-Specific Robot Data Generation**.

Authors: Bowei Li, Yuner Zhang, and Changliu Liu.

Live site: https://boweili666.github.io/ARSTAG/

This repository contains the static project website and its media. It is not the research implementation. The current website includes the method overview, selected real-robot demonstrations, experimental results, and the narrated project video. The manuscript is not included.

## Editing

- `index.html`: project text, author list, experimental tables, and media references.
- `styles.css`: responsive layout and typography.
- `script.js`: accessible controls for the demonstration loops.
- `assets/`: project figures, videos, poster images, and English captions.

Run `python3 -m http.server 8000` in this directory to preview locally.

GitHub Pages serves the repository root on the `main` branch. All media paths are relative so the site works at `/ARSTAG/`.

The experimental values and media come from the authors' ARSTAG manuscript and accompanying video. Reproduction or reuse of research media requires permission from the authors.
