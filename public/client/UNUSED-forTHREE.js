import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene;
let camera;
let renderer;
let house;

let model_container = document.querySelector('.web-gl');

const init = ()=>{
    scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const fov = 50;
    const near = 1;
    const far = 1000;
    const focus = 10;
    const zoom = 1;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far, focus, zoom);
    camera.position.set(100,100,20);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: model_container
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio: 1);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0x1d27f0, 5);
    spotLight1.position.set(6, 550, 6); //X- Y-Height -?
    const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1, 0x00ff00);
    scene.add(spotLight1);
    scene.add(spotLightHelper1);

    const spotlight2 = new THREE.SpotLight(0xfffb, 2);
    spotlight2.position.set(-10, 350, 12);
    scene.add(spotlight2);

    const loader = new GLTFLoader();
    loader.load('./models/building.glb', (gltf)=>{
        house = gltf.scene.children[0];
        house.scale.set(1.9, 1.9, 1.9);
        house.position.set(0, -2.3, 0);
        scene.add(gltf.scene);
    });

    animate();
}

const render = ()=>{
    renderer.render(scene, camera);
}

const animate = ()=>{
    requestAnimationFrame(animate);
    render()
}

const windowResize = ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
window.addEventListener('resize', windowResize, false);
window.onload = init;