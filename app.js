const colleges = window.colleges;
const homeView = document.querySelector('#homeView');
const detailView = document.querySelector('#detailView');
const collegeGrid = document.querySelector('#collegeGrid');
const overlayGrid = document.querySelector('#overlayGrid');
const directoryOverlay = document.querySelector('#directoryOverlay');
const statusLine = document.querySelector('#statusLine');
const cameraMount = document.querySelector('#cameraMount');
const scanButton = document.querySelector('#scanButton');
let compiledTargetUrl = null;
let mindarScene = null;
let detailIndex = 0;
let mascotRenderer = null;
let mascotScene = null;
let mascotCamera = null;
let mascotGroup = null;
let mascotAnimation = 0;
let mascotPointer = null;

function collegeCard(college, index) {
  return `<button class="college-card" type="button" data-college="${index}" style="--college-color:${college.color}">
    <span class="card-index">${String(index + 1).padStart(2, '0')}</span>
    <span class="card-logo"><img src="${college.logo}" alt="" /></span>
    <span class="card-copy"><strong>${college.name}</strong><small>${college.code} <i>·</i> PROFILE</small></span>
    <span class="card-arrow" aria-hidden="true">↗</span>
  </button>`;
}

collegeGrid.innerHTML = colleges.map(collegeCard).join('');
overlayGrid.innerHTML = colleges.map(collegeCard).join('');
document.querySelector('#detailLinks').innerHTML = colleges.map((college, index) => `<button type="button" data-college="${index}" aria-label="Open ${college.name}">${college.code}</button>`).join('');

document.addEventListener('click', (event) => {
  const card = event.target.closest('[data-college]');
  if (card) openCollege(Number(card.dataset.college));
});

document.querySelector('#browseButton').addEventListener('click', () => {
  directoryOverlay.hidden = false;
  directoryOverlay.classList.add('is-open');
});
document.querySelector('#closeDirectory').addEventListener('click', closeDirectory);
directoryOverlay.addEventListener('click', (event) => {
  if (event.target === directoryOverlay) closeDirectory();
});
document.querySelector('#backButton').addEventListener('click', closeCollege);
scanButton.addEventListener('click', startCameraScan);

function closeDirectory() {
  directoryOverlay.classList.remove('is-open');
  directoryOverlay.hidden = true;
}

function openCollege(index) {
  detailIndex = index;
  const college = colleges[index];
  closeDirectory();
  homeView.hidden = true;
  detailView.hidden = false;
  document.querySelector('#detailCode').textContent = college.code;
  document.querySelector('#detailName').textContent = college.name;
  document.querySelector('#detailLogo').src = college.logo;
  document.querySelector('#detailLogo').alt = `${college.name} logo`;
  document.querySelector('#detailDescription').textContent = college.description;
  document.querySelector('#mascotName').textContent = `${college.mascot} · draft concept`;
  document.querySelector('#modelIndex').textContent = `${String(index + 1).padStart(2, '0')} / 08`;
  document.querySelectorAll('#detailLinks button').forEach((button, buttonIndex) => {
    button.classList.toggle('is-current', buttonIndex === index);
  });
  startMascot(college.animal, college.color);
}

function closeCollege() {
  detailView.hidden = true;
  homeView.hidden = false;
  stopMascot();
  document.querySelector('#directory').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createAnimal(THREE, animal, color) {
  const group = new THREE.Group();
  const coat = new THREE.MeshStandardMaterial({ color, roughness: 0.72 });
  const light = new THREE.MeshStandardMaterial({ color: '#e8d8b7', roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: '#252d29', roughness: 0.45 });
  const gold = new THREE.MeshStandardMaterial({ color: '#d8a84e', roughness: 0.4, metalness: 0.18 });
  const sphere = (name, scale, position, material = coat) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), material);
    mesh.name = name;
    mesh.scale.set(...scale);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const cone = (position, rotation, size, material = coat) => {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(size, size * 2.2, 20), material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    group.add(mesh);
    return mesh;
  };
  const cylinder = (position, rotation, radius, length, material = coat) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.88, length, 16), material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    group.add(mesh);
    return mesh;
  };

  if (animal === 'eagle') {
    sphere('body', [0.52, 0.38, 0.3], [0, -0.02, 0]);
    sphere('head', [0.28, 0.29, 0.26], [0.05, 0.32, 0.02], light);
    cone([0.3, 0.28, 0.06], [0, 0, -Math.PI / 2], 0.1, gold);
    for (const side of [-1, 1]) {
      const wing = sphere('wing', [0.48, 0.16, 0.1], [side * 0.45, 0.02, -0.02]);
      wing.rotation.z = side * -0.15;
      for (let feather = 0; feather < 3; feather++) cone([side * (0.62 + feather * 0.1), -0.06 - feather * 0.05, 0], [0, 0, side * -0.8], 0.06, gold);
    }
  } else if (animal === 'owl') {
    sphere('body', [0.4, 0.5, 0.32], [0, -0.03, 0]);
    sphere('face', [0.32, 0.3, 0.12], [0, 0.25, 0.25], light);
    for (const side of [-1, 1]) {
      cone([side * 0.23, 0.54, 0], [0, 0, side * -0.15], 0.11);
      sphere('eye', [0.09, 0.1, 0.06], [side * 0.13, 0.28, 0.35], gold);
      sphere('pupil', [0.035, 0.05, 0.03], [side * 0.13, 0.28, 0.405], dark);
    }
    cone([0, 0.12, 0.38], [Math.PI / 2, 0, 0], 0.08, gold);
  } else if (animal === 'dolphin') {
    sphere('body', [0.65, 0.28, 0.3], [-0.08, 0.05, 0]);
    sphere('snout', [0.34, 0.11, 0.14], [0.58, 0.07, 0.02], coat);
    cone([-0.67, 0.18, 0], [0, 0, Math.PI / 2], 0.2);
    cone([-0.57, -0.02, 0], [0, 0, Math.PI / 2], 0.13);
    cone([0.1, -0.2, 0], [0, 0, Math.PI], 0.14);
    sphere('eye', [0.035, 0.04, 0.035], [0.34, 0.14, 0.27], dark);
  } else if (animal === 'snake') {
    for (let segment = 0; segment < 6; segment++) {
      const angle = segment * 0.9;
      sphere('coil', [0.2, 0.16, 0.17], [Math.cos(angle) * 0.34, -0.19 + Math.sin(angle * 2) * 0.04, Math.sin(angle) * 0.2]);
    }
    sphere('head', [0.2, 0.15, 0.18], [0.48, 0.13, 0.04]);
    sphere('eye', [0.035, 0.04, 0.03], [0.53, 0.2, 0.17], gold);
    sphere('eye', [0.035, 0.04, 0.03], [0.53, 0.2, -0.09], gold);
  } else {
    sphere('body', [0.49, 0.3, 0.27], [-0.05, -0.04, 0]);
    sphere('head', [0.3, 0.27, 0.25], [0.38, 0.23, 0]);
    sphere('muzzle', [0.2, 0.12, 0.17], [0.59, 0.12, 0], light);
    for (const side of [-1, 1]) {
      cone([0.26, 0.48, side * 0.14], [side * 0.18, 0, -0.12], 0.12);
      sphere('eye', [0.035, 0.045, 0.035], [0.45, 0.29, side * 0.21], dark);
      sphere('leg', [0.1, 0.25, 0.1], [side * 0.26, -0.34, 0.12]);
      sphere('leg', [0.1, 0.25, 0.1], [side * 0.26, -0.34, -0.12]);
    }
    const tail = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.055, 12, 28), gold);
    tail.position.set(-0.49, 0.03, 0);
    tail.rotation.y = Math.PI / 2;
    group.add(tail);
  }

  for (const side of [-1, 1]) {
    sphere('eye', [0.035, 0.04, 0.03], [0.14, 0.39, side * 0.18], dark);
  }
  group.userData.materials = [coat, light, dark, gold];
  return group;
}

function startMascot(animal, color) {
  stopMascot();
  const unavailable = document.querySelector('#modelUnavailable');
  if (!window.AFRAME?.THREE) {
    unavailable.hidden = false;
    return;
  }
  unavailable.hidden = true;
  const THREE = window.AFRAME.THREE;
  const canvas = document.querySelector('#mascotCanvas');
  if (!mascotRenderer) {
    mascotScene = new THREE.Scene();
    mascotScene.background = new THREE.Color('#eef0e9');
    mascotCamera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    mascotCamera.position.set(0, 0.4, 4.3);
    mascotRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    mascotRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mascotRenderer.shadowMap.enabled = true;
    mascotRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mascotRenderer.outputColorSpace = THREE.SRGBColorSpace;
    mascotScene.add(new THREE.HemisphereLight('#fff8e9', '#89958e', 2.1));
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.2);
    keyLight.position.set(-3, 5, 4);
    keyLight.castShadow = true;
    mascotScene.add(keyLight);
    const fillLight = new THREE.DirectionalLight('#df9e4c', 1.1);
    fillLight.position.set(3, 1, 2);
    mascotScene.add(fillLight);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(1.05, 48), new THREE.MeshStandardMaterial({ color: '#dce0d4', roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.72;
    ground.receiveShadow = true;
    mascotScene.add(ground);
  }
  mascotGroup = createAnimal(THREE, animal, color);
  mascotGroup.position.y = -0.05;
  mascotScene.add(mascotGroup);
  mascotPointer = { down: false, x: 0, rotation: 0 };
  canvas.addEventListener('pointerdown', mascotPointerDown);
  canvas.addEventListener('pointermove', mascotPointerMove);
  canvas.addEventListener('pointerup', mascotPointerUp);
  canvas.addEventListener('pointercancel', mascotPointerUp);
  window.addEventListener('resize', resizeMascot);
  resizeMascot();
  drawMascot();
}

function mascotPointerDown(event) {
  mascotPointer.down = true;
  mascotPointer.x = event.clientX;
  event.currentTarget.setPointerCapture(event.pointerId);
}
function mascotPointerMove(event) {
  if (!mascotPointer?.down || !mascotGroup) return;
  mascotGroup.rotation.y += (event.clientX - mascotPointer.x) * 0.012;
  mascotPointer.x = event.clientX;
}
function mascotPointerUp() { if (mascotPointer) mascotPointer.down = false; }
function resizeMascot() {
  if (!mascotRenderer || !mascotCamera) return;
  const canvas = mascotRenderer.domElement;
  const width = Math.max(canvas.clientWidth, 1);
  const height = Math.max(canvas.clientHeight, 1);
  mascotRenderer.setSize(width, height, false);
  mascotCamera.aspect = width / height;
  mascotCamera.updateProjectionMatrix();
}
function drawMascot() {
  mascotAnimation = requestAnimationFrame(drawMascot);
  if (!mascotPointer?.down && mascotGroup) mascotGroup.rotation.y += 0.005;
  if (mascotRenderer && mascotScene && mascotCamera) mascotRenderer.render(mascotScene, mascotCamera);
}
function stopMascot() {
  cancelAnimationFrame(mascotAnimation);
  window.removeEventListener('resize', resizeMascot);
  const canvas = document.querySelector('#mascotCanvas');
  if (canvas) {
    canvas.removeEventListener('pointerdown', mascotPointerDown);
    canvas.removeEventListener('pointermove', mascotPointerMove);
    canvas.removeEventListener('pointerup', mascotPointerUp);
    canvas.removeEventListener('pointercancel', mascotPointerUp);
  }
  if (mascotGroup) {
    mascotScene.remove(mascotGroup);
    mascotGroup.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose();
    });
  }
  mascotGroup = mascotPointer = null;
}

async function compileTarget() {
  const image = document.querySelector('.target-guide img');
  if (!image.complete || !image.naturalWidth) {
    await new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
    });
  }
  const compiler = new window.MINDAR.IMAGE.Compiler();
  await compiler.compileImageTargets([image], (progress) => {
    statusLine.innerHTML = `<span class="status-dot"></span><span>Preparing the CU logo for scanning… ${Math.round(progress)}%</span>`;
  });
  const targetBlob = new Blob([compiler.exportData()], { type: 'application/octet-stream' });
  compiledTargetUrl = URL.createObjectURL(targetBlob);
}

async function startCameraScan() {
  scanButton.disabled = true;
  try {
    if (!compiledTargetUrl) await compileTarget();
    statusLine.innerHTML = '<span class="status-dot"></span><span>Starting camera… allow access when prompted.</span>';
    cameraMount.innerHTML = `<a-scene id="mindarScene" class="ar-scene" embedded mindar-image="imageTargetSrc: ${compiledTargetUrl}; autoStart: true; uiLoading: no; uiError: no; uiScanning: no" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights: true" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      <a-assets>${colleges.map((college, index) => `<img id="college-logo-${index}" src="${college.logo}" crossorigin="anonymous" />`).join('')}</a-assets>
      <a-camera position="0 0 0" look-controls="enabled: false" cursor="rayOrigin: mouse" raycaster="objects: .ar-logo-hitbox"></a-camera>
      <a-entity mindar-image-target="targetIndex: 0" id="collegeTargets">
        ${colleges.map((college, index) => {
          const positions = [[-0.65, 0.48], [-0.22, 0.48], [0.22, 0.48], [0.65, 0.48], [-0.65, -0.48], [-0.22, -0.48], [0.22, -0.48], [0.65, -0.48]];
          const [x, y] = positions[index];
          return `<a-entity class="ar-college" data-college="${index}" position="${x} ${y} 0.1">
            <a-plane class="ar-logo-hitbox" position="0 0 0" width="0.29" height="0.29" material="color: #ffffff; shader: flat; opacity: 0.94; transparent: true" geometry="primitive: plane; width: 0.29; height: 0.29" ></a-plane>
            <a-image class="ar-logo" src="#college-logo-${index}" position="0 0 0.012" width="0.25" height="0.25" material="shader: flat; transparent: true"></a-image>
            <a-text value="${college.code}" position="0 -0.19 0.02" align="center" color="#ffffff" width="1.1" scale="0.5 0.5 0.5"></a-text>
          </a-entity>`;
        }).join('')}
      </a-entity>
    </a-scene>`;
    mindarScene = document.querySelector('#mindarScene');
    const target = document.querySelector('#collegeTargets');
    target.addEventListener('targetFound', () => {
      document.querySelector('.target-guide').classList.add('is-found');
      statusLine.innerHTML = '<span class="status-dot status-ready"></span><span>CU logo recognized. Tap a floating college seal.</span>';
    });
    target.addEventListener('targetLost', () => {
      document.querySelector('.target-guide').classList.remove('is-found');
      statusLine.innerHTML = '<span class="status-dot"></span><span>Point the camera at the CU logo to continue.</span>';
    });
    document.addEventListener('click', onArLogoClick);
  } catch (error) {
    statusLine.innerHTML = '<span class="status-dot status-error"></span><span>Could not prepare AR. Check your connection, camera permission, and HTTPS access.</span>';
    console.error(error);
  } finally {
    scanButton.disabled = false;
  }
}

function onArLogoClick(event) {
  const logo = event.target.closest('.ar-college');
  if (!logo) return;
  const index = Number(logo.dataset.college);
  if (Number.isInteger(index)) openCollege(index);
}

window.addEventListener('beforeunload', () => {
  if (compiledTargetUrl) URL.revokeObjectURL(compiledTargetUrl);
  stopMascot();
  mascotRenderer?.dispose();
});