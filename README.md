# Capitol University AR Directory

A static browser app using MindAR image tracking and Three.js (through A-Frame) for interactive 3D mascot studies.

## Run locally

Camera access requires `localhost` or HTTPS. The current preview is served at `http://127.0.0.1:8080/` by a PowerShell `HttpListener`; it remains available while that server session is running. Node.js and Python are not installed in the current environment.

XAMPP is installed and `C:\xampp\htdocs\cuu` links to this workspace, but Apache currently fails because `C:\xampp\apache\conf\httpd.conf` points `ServerRoot` to the nonexistent `C:/xamppq/apache`. Correct that path to `C:/xampp/apache` before starting Apache; then visit `http://localhost/cuu/`. Opening `index.html` directly will not enable camera access.

## AR setup

1. Select **Start camera scan** and allow camera access.
2. The app prepares its bundled CU logo target automatically and opens the camera.
3. Hold the CU seal in view. Tap one of the eight floating college logos to open its profile; **All colleges** returns to the directory.

The target compilation runs locally in the browser. MindAR, A-Frame, and the font files are loaded from their public CDNs, so internet access is required.

## Current content status

The supplied PNGs are used as the CU target and eight college logos. College names are transcribed from the supplied seals. Capitol University's official website could not be retrieved during setup, and the supplied seals do not identify all eight animal mascots. Profile descriptions therefore remain clearly marked as pending, and 3D animals are draft concepts, not verified official mascot pairings. Replace `description`, `mascot`, and `animal` in `data.js` with verified CU content before presenting this as a completed official directory.

The animal previews are procedural Three.js geometry, not photographs or 2D illustrations. Drag in the model stage to rotate them.

## Assets

- `assets/cu.png` — CU logo image target source
- `assets/ccs.png`, `assets/coc.png`, `assets/cme.png`, `assets/cohs.png`, `assets/coe.png`, `assets/ced.png`, `assets/cba.png`, `assets/cas.png` — college logos