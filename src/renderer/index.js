import THREE from 'three';
import setupStats from './stats';
import StereoEffect from './effects/StereoEffect';

export function createRenderer(useVR) {
    const baseRenderer = getBaseRenderer();
    const vrRenderer = setupVR(useVR, baseRenderer);
    const renderer = vrRenderer ? vrRenderer : baseRenderer;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 100); // 1m = 0.0625 units
    const resizer = setupResizer(renderer, camera);
    const stats = setupStats(useVR);
    return {
        domElement: baseRenderer.domElement,
        render: scene => {
            renderer.render(scene, camera);
        },
        dispose: () => {
            resizer.dispose();
            stats.dispose();
        },
        stats: stats,
        camera: camera
    };
}

function getBaseRenderer() {
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
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

function setupResizer(renderer, camera) {
    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resize);
    return {dispose: () => { window.removeEventListener('resize', resize) }};
}

function setupVR(useVR, baseRenderer) {
    if (useVR) {
        const stereoEffect = new StereoEffect(baseRenderer);
        stereoEffect.eyeSeparation = 0.006;
        stereoEffect.setSize(window.width, window.height);
        return stereoEffect;
    }
}