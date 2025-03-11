import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18.0/dist/lil-gui.esm.js';


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
// groundGeometry.rotateX(-Math.PI / 2);
// const groundMaterial = new THREE.MeshStandardMaterial({
//   color: 0x000000,
//   side: THREE.DoubleSide
// });
// const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// groundMesh.castShadow = false;
// groundMesh.receiveShadow = true;
// scene.add(groundMesh);

const light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
scene.add( light );

const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(20, 25, 2.8);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );

const gui = new GUI();
const lightFolder = gui.addFolder('Spotlight Position');
lightFolder.add(spotLight.position, 'x', -20, 20).name('X Position');
lightFolder.add(spotLight.position, 'y', 0, 50).name('Y Position');
lightFolder.add(spotLight.position, 'z', -20, 20).name('Z Position');
lightFolder.open();

const loader = new GLTFLoader();
loader.load( 'public/headstone.gltf', function ( gltf ) {

  gltf.scene.traverse((child) => {
  if (child.isMesh) {
      const existingMaterial = child.material;
      const newMaterial = new THREE.MeshStandardMaterial({
        map: existingMaterial.map
      });

    child.material = newMaterial;
    child.castShadow = true;
    child.receiveShadow = true;
  }
})

	scene.add( gltf.scene );
  gltf.scene.position.y += 0.5;

}, undefined, function ( error ) {

	console.error( error );

} );

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
