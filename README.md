# Capitol University AR Directory

A static browser app using MindAR image tracking and Three.js (through A-Frame) for interactive 3D mascot studies.

## Use on a phone

1. Select **Start camera scan** and allow camera access.
2. The app prepares its bundled CU logo target automatically and opens the camera; no image upload is needed.
3. Hold a printed CU seal or a second screen showing the seal in view to reveal the directory. You can also scan any of the eight college logos to open that college's profile directly.
4. Tap one of the floating college logos or **All colleges** to navigate between profiles and the directory.

The site must be opened over HTTPS or localhost. MindAR, A-Frame, and the font files load from public CDNs, so internet access is required.

## Current content status

The supplied PNGs are used as the CU target and eight college logos. College names are transcribed from the supplied seals. The eight descriptions supplied for this project are included as unverified draft copy. Capitol University's official website could not be retrieved during setup, and the supplied seals do not identify all eight animal mascots. The 3D animals are draft concepts, not verified official mascot pairings. Verify `description`, `mascot`, and `animal` in `data.js` against CU sources before presenting this as a completed official directory.

The animal previews are procedural Three.js geometry, not photographs or 2D illustrations. Drag in the model stage to rotate them.

## Assets

- `assets/cu.png` — CU logo image target source
- `assets/ccs.png`, `assets/coc.png`, `assets/cme.png`, `assets/cohs.png`, `assets/coe.png`, `assets/ced.png`, `assets/cba.png`, `assets/cas.png` — college logos