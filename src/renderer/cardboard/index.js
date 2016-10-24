'use strict';

import THREE from 'three';
import Cardboard from './Cardboard';
import OrbitControls from './OrbitControls';
import {
    CardboardView,
    findScreenParams,
    updateBarrelDistortion
} from './CardboardView';
import EffectComposer from '../effects/postprocess/EffectComposer';
import ShaderPass from '../effects/postprocess/ShaderPass';
import CardboardStereoEffect from './CardboardStereoEffect';
import CardboardBarrelDistortion from './CardboardBarrelDistortion';

// meter units
var CAMERA_HEIGHT = 0;
var CAMERA_NEAR = 0.1;
var CAMERA_FAR = 100;

var camera, scene, renderer, composer;
var controls;
var element, container;

var clock = new THREE.Clock();

export function loadCalibrationScene() {
    var device = Cardboard.uriToParams('https://vr.google.com/cardboard/download/?p=CgZBZHJpNDISB0hvb3Rvb1gd9P3UPCWmm0Q9KhAAADRCAAA0QgAANEIAADRCWAA1bxIDPToICtejPQrXozxQAGAA');
    init_with_cardboard_device(device);
}

function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    composer.setSize(width, height);
}

function animate(t) {
    var delta = clock.getDelta();
    camera.updateProjectionMatrix();
    controls.update(delta);
    composer.render();

    window.requestAnimationFrame(animate);
}

function setOrientationControls(e) {
    if (!e.alpha) {
        return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);
}

function init_with_cardboard_device(cardboard_device) {
    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    element = renderer.domElement;
    container = document.getElementById('main');
    container.appendChild(element);

    scene = new THREE.Scene();

    // NOTE: CardboardStereoPass will ignore camera FOV and aspect ratio
    camera = new THREE.PerspectiveCamera(90, 1, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(0, CAMERA_HEIGHT, 0);
    scene.add(camera);

    controls = new OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
    );
    controls.enableZoom = false;
    controls.enablePan = false;

    window.addEventListener('deviceorientation', setOrientationControls, true);

    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    scene.add(light);

    // environment box with grid textures
    var box_width = 10;  // i.e. surfaces are box_width/2 from camera
    var loader = new THREE.TextureLoader();
    var texture = loader.load('images/box.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(box_width, box_width);
    var face_colors = [0xA020A0, 0x20A020, 0x50A0F0, 0x404040, 0xA0A0A0, 0xA0A020];
    var materialArray = [];
    face_colors.forEach(function (c) {
        materialArray.push(new THREE.MeshBasicMaterial({
            map: texture,
            color: c,
            side: THREE.BackSide
        }));
    });
    var env_cube = new THREE.Mesh(
        new THREE.BoxGeometry(box_width, box_width, box_width),
        new THREE.MeshFaceMaterial(materialArray)
    );
    scene.add(env_cube);

    var screen_params = findScreenParams();
    var cardboard_view = new CardboardView(screen_params, cardboard_device);

    composer = new EffectComposer(renderer);

    composer.addPass(new CardboardStereoEffect(cardboard_view, scene, camera));

    var barrel_distortion = new ShaderPass(CardboardBarrelDistortion);
    barrel_distortion.uniforms.backgroundColor.value = new THREE.Vector4(1, 0, 0, 1);
    barrel_distortion.renderToScreen = true;
    composer.addPass(barrel_distortion);

    // Do this when value is changed too
    updateBarrelDistortion(barrel_distortion, cardboard_view, CAMERA_NEAR, CAMERA_FAR, true);

    window.addEventListener('resize', resize, false);
    window.setTimeout(resize, 1);

    animate();
}
