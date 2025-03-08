import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTex = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTex = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTex = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTex = textureLoader.load("./textures/door/height.jpg");
const doorNormalTex = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTex = textureLoader.load("./textures/door/metalness.jpg");
const doorRoughnessTex = textureLoader.load("./textures/door/roughness.jpg");
const matcapTex = textureLoader.load("./textures/matcaps/3.png");
const gradientTex = textureLoader.load("./textures/gradients/5.jpg");
doorColorTex.colorSpace = THREE.SRGBColorSpace;
matcapTex.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial();
//material.map = doorColorTex;
// material.color = new THREE.Color("#ff0000");
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTex;
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTex;

// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshToonMaterial();
// gradientTex.minFilter = THREE.NearestFilter;
// gradientTex.magFilter = THREE.NearestFilter;
// gradientTex.generateMipmaps = false;
// material.gradientMap = gradientTex;
// material.shininess = 10;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTex;
// material.aoMap = doorAmbientOcclusionTex;
// material.displacementMap = doorHeightTex;
// material.displacementScale = 0.1;
// material.side = THREE.DoubleSide;
// material.metalnessMap = doorMetalnessTex;
// material.roughnessMap = doorRoughnessTex;
// material.normalMap = doorNormalTex;

// material.transparent = true;
// // material.opacity = 0.5;
// material.alphaMap = doorAlphaTex;

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorColorTex;
// material.aoMap = doorAmbientOcclusionTex;
// material.displacementMap = doorHeightTex;
// material.displacementScale = 0.1;
// material.side = THREE.DoubleSide;
// material.metalnessMap = doorMetalnessTex;
// material.roughnessMap = doorRoughnessTex;
// material.normalMap = doorNormalTex;

// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTex;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.01);

// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);

material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 30);
// scene.add(pointLight);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (envMap) => {
  console.log(envMap);
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.rotation.y = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  sphere.rotation.y = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
