// @flow

import THREE from 'three';
import {each} from 'lodash';
import {createRenderer} from './renderer';
import {mainGameLoop} from './game/loop';
import {createSceneManager} from './game/scenes';
import {Target, Movement, createHero} from './game/hero';
import {makeFirstPersonMouseControls} from './controls/mouse';
import {makeKeyboardControls} from './controls/keyboard';
import {makeGyroscopeControls} from './controls/gyroscope';
import {makeGamepadControls} from './controls/gamepad';
import {getQueryParams} from './utils';
import {loadCalibrationScene} from './renderer/cardboard';
import * as debugFlags from './debugFlags';

const params = getQueryParams();

each(params, (value, param) => {
    if (param in debugFlags) {
        debugFlags[param] = (value == 'true');
    }
});

window.onload = function() {
    if (params.calibrate == 'true') {
        loadCalibrationScene();
        setupHashWatcher();
    } else {
        const isMobile = /Mobile|webOS|iPhone|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || params.mobile;
        const renderer = createRenderer(isMobile);
        const heroConfig = {
            physics: {
                enabled: true,
                targets: [Target.CAMERA],
                movement: Movement.NORMAL,
                speed: new THREE.Vector3(0.15, 0.3, 0.3)
            }
        };
        const hero = createHero(heroConfig);
        createSceneManager(renderer, hero, sceneManager => {
            const controls = isMobile ? [
                makeGyroscopeControls(hero.physics),
                makeGamepadControls(hero.physics, sceneManager)
            ] : [
                makeFirstPersonMouseControls(renderer.domElement, hero.physics),
                makeKeyboardControls(hero.physics, sceneManager),
                makeGamepadControls(hero.physics, sceneManager)
            ];

            document.getElementById('main').appendChild(renderer.domElement);
            sceneManager.goto(parseInt(params.scene) || 0);

            const clock = new THREE.Clock();
            function processAnimationFrame() {
                mainGameLoop(clock, renderer, sceneManager.getScene(), hero, controls);
                requestAnimationFrame(processAnimationFrame);
            }

            processAnimationFrame();

            setupHashWatcher(sceneManager);
        });
    }
};

function setupHashWatcher(sceneManager) {
    window.addEventListener('hashchange', () => {
        const newParams = getQueryParams();
        if (newParams.scene == params.scene) {
            window.location.reload();
        } else if ('scene' in newParams) {
            if (sceneManager) {
                sceneManager.goto(parseInt(newParams.scene));
            } else {
                window.location.reload();
            }
        }
    }, false);
}