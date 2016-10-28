import THREE from 'three';
import SMAAPass from './effects/postprocess/SMAAPass';
import RenderPass from './effects/postprocess/RenderPass';
import setupStats from './stats';
import {
    get3DCamera,
    resize3DCamera,
    getIsometricCamera,
    resizeIsometricCamera
} from './cameras';
import Cardboard from './cardboard/Cardboard';
import {
    CardboardView,
    findScreenParams,
    updateBarrelDistortion
} from './cardboard/CardboardView';
import EffectComposer from './effects/postprocess/EffectComposer';
import ShaderPass from './effects/postprocess/ShaderPass';
import CardboardStereoEffect from './cardboard/CardboardStereoEffect';
import CardboardBarrelDistortion from './cardboard/CardboardBarrelDistortion';
import {map} from 'lodash';

const PixelRatioMode = {
    DEVICE: () => window.devicePixelRatio || 1.0,
    DOUBLE: () => 2.0,
    NORMAL: () => 1.0,
    HALF: () => 0.5,
    QUARTER: () => 0.25
};

const PixelRatio = map(['DEVICE', 'DOUBLE', 'NORMAL', 'HALF', 'QUARTER'], (name, idx) => ({
    getValue: PixelRatioMode[name],
    index: idx,
    name: name
}));

export function createRenderer(useVR) {
    let pixelRatio = PixelRatio[0];
    let antialias = false;
    const displayRenderMode = () => console.log(`Renderer mode: pixelRatio=${pixelRatio.name}(${pixelRatio.getValue()}x), antialiasing(${antialias})`);
    const baseRenderer = setupBaseRenderer(pixelRatio);
    const renderer = useVR ? setupVR(baseRenderer) : baseRenderer;
    const camera3D = get3DCamera();
    const cameraIso = getIsometricCamera();
    const resizer = setupResizer(renderer, camera3D, cameraIso);
    //let smaa = setupSMAA(renderer, pixelRatio);
    const stats = setupStats(useVR);

    window.addEventListener('keydown', event => {
        if (event.code == 'KeyH') {
            antialias = !antialias;
            displayRenderMode();
            window.dispatchEvent(new CustomEvent('resize'));
        }
        if (event.code == 'KeyR') {
            pixelRatio = PixelRatio[(pixelRatio.index + 1) % PixelRatio.length];
            baseRenderer.setPixelRatio(pixelRatio.getValue());
            //smaa = setupSMAA(renderer, pixelRatio);
            displayRenderMode();
            window.dispatchEvent(new CustomEvent('resize'));
        }
    });

    displayRenderMode();

    return {
        domElement: baseRenderer.domElement,
        render: scene => {
            renderer.antialias = antialias;
            const camera = scene.isIsland ? camera3D : cameraIso;
            if (antialias) {
                //smaa.render(scene.threeScene, camera);
            }
            else {
                renderer.render(scene.threeScene, camera);
            }
        },
        dispose: () => {
            resizer.dispose();
            stats.dispose();
        },
        applySceneryProps: props => {
            const sc = props.envInfo.skyColor;
            const color = new THREE.Color(sc[0], sc[1], sc[2]);
            baseRenderer.setClearColor(color.getHex(), 1);
        },
        stats: stats,
        cameras: {
            camera3D: camera3D,
            isoCamera: cameraIso
        }
    };
}

function setupBaseRenderer(pixelRatio) {
    const renderer = new THREE.WebGLRenderer({antialias: false, alpha: false, logarithmicDepthBuffer: true});
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(pixelRatio.getValue());
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = true;

    renderer.context.getExtension('EXT_shader_texture_lod');
    renderer.context.getExtension('OES_standard_derivatives');

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.left = 0;
    renderer.domElement.style.top = 0;
    renderer.domElement.style.opacity = 1.0;

    return renderer;
}

function setupSMAA(renderer, pixelRatio) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass();
    composer.addPass(renderPass);

    const pass = new SMAAPass(window.innerWidth * pixelRatio.getValue(), window.innerHeight * pixelRatio.getValue());
    pass.renderToScreen = true;
    composer.addPass(pass);
    return {
        render(scene, camera) {
            renderPass.scene = scene;
            renderPass.camera = camera;
            composer.render();
        }
    }
}

function setupResizer(renderer, camera3D, cameraIso) {
    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        resize3DCamera(camera3D);
        resizeIsometricCamera(cameraIso);
    }

    window.addEventListener('resize', resize);
    return {dispose: () => { window.removeEventListener('resize', resize) }};
}

function setupVR(baseRenderer) {
    const cardboard_device = Cardboard.uriToParams('http://google.com/cardboard/cfg?p=CgZBZHJpNDISB0hvb3Rvb1odCtcjPSWmm0Q9KhAAAEhCAABIQgAASEIAAEhCWAA146UbPToIexSuPs3MTL1QAGAA');
    const screen_params = findScreenParams();
    const cardboard_view = new CardboardView(screen_params, cardboard_device);

    const composer = new EffectComposer(baseRenderer);

    const stereoEffect = new CardboardStereoEffect(cardboard_view, new THREE.Scene(), new THREE.PerspectiveCamera(), 6.0);
    composer.addPass(stereoEffect);

    var barrel_distortion = new ShaderPass(CardboardBarrelDistortion);
    barrel_distortion.uniforms.backgroundColor.value = new THREE.Vector4(0, 0, 0, 1);
    barrel_distortion.renderToScreen = true;
    composer.addPass(barrel_distortion);

    baseRenderer.autoClear = false;

    // Do this when value is changed too
    return {
        render(scene, camera) {
            camera.updateProjectionMatrix();
            updateBarrelDistortion(barrel_distortion, cardboard_view, camera.near, camera.far, false);
            stereoEffect.scene = scene;
            stereoEffect.camera = camera;
            composer.render();
        },
        setSize(width, height) {
          composer.setSize(width, height);
        }
    }
}
