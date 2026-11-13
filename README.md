# Capitol University AR Directory

A static browser app using MindAR image tracking and Three.js (through A-Frame) for interactive 3D mascot studies.

## Use on a phone

1. Select **Start camera scan** and allow camera access.
2. The app prepares its bundled CU logo target automatically and opens the camera; no image upload is needed.
3. Hold a printed CU seal or a second screen showing the seal in view. Tap one of the eight floating college logos to open its profile; **All colleges** returns to the directory.

The site must be opened over HTTPS or localhost. MindAR, A-Frame, and the font files load from public CDNs, so internet access is required.

## Content status

The supplied PNGs are used as the CU target and eight college logos. College names are transcribed from the supplied seals. Official descriptions and animal mascot assignments still need verification against Capitol University sources. The profile text and procedural 3D animals are marked as drafts, not official information. Replace description, mascot, and animal in data.js with verified CU content before presenting this as a completed official directory.

The animal previews are procedural Three.js geometry, not photographs or 2D illustrations. Drag in the model stage to rotate them.

## Assets

- assets/cu.png — CU logo target source
- assets/ccs.png, assets/coc.png, assets/cme.png, assets/cohs.png, assets/coe.png, assets/ced.png, assets/cba.png, assets/cas.png — college logos
