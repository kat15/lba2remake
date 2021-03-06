// @flow
import * as THREE from 'three';
import async from 'async';

import {createState} from './state';
import {createAudioManager} from '../audio'
import {loadHqrAsync} from '../hqr';
import {loadTextsAsync} from '../text';

export function createGame(params: Object, clock: Object, setUiState: Function, getUiState: Function) {
    let _isPaused = false;
    let _isLoading = false;

    let _state = createState();

    const _audio = createAudioManager(_state);

    return {
        setUiState,
        getUiState,
        controlsState: {
            heroSpeed: 0,
            heroRotationSpeed: 0,
            cameraSpeed: new THREE.Vector3(),
            cameraLerp: new THREE.Vector3(),
            cameraLookAtLerp: new THREE.Vector3(),
            cameraOrientation: new THREE.Quaternion(),
            cameraHeadOrientation: new THREE.Quaternion(),
            freeCamera: false,
            action: 0,
            jump: 0,
            fight: 0,
            crunch: 0,
            weapon: 0
        },
        resetState: function() {
            _state = createState();
            this.resetControlsState();
        },
        resetControlsState: function() {
            this.controlsState.heroSpeed = 0;
            this.controlsState.heroRotationSpeed = 0;
            this.controlsState.action = 0;
            this.controlsState.jump = 0;
            this.controlsState.fight = 0;
            this.controlsState.crunch = 0;
            this.controlsState.weapon = 0;
        },
        loading: function(index: number) {
            _isPaused = true;
            _isLoading = true;
            clock.stop();
            this.setUiState({loading: true});
            console.log(`Loading scene #${index}`);
        },
        loaded: function() {
            _isPaused = false;
            if (!_isPaused)
                clock.start();
            _isLoading = false;
            this.setUiState({loading: false});
            console.log("Loaded!");
        },

        isPaused: () => _isPaused,
        isLoading: () => _isLoading,

        getState: () => _state,
        getAudioManager: () => _audio,

        pause: () => {
            _isPaused = !_isPaused;
            if(_isPaused) {
                clock.stop();
                console.log("Pause");
            } else {
                clock.start();
            }
        },
        preload: function(callback: Function) {
            const that = this;
            async.auto({
                loading: preloadFileAsync('images/30_screen_loading.png'),
                menu: preloadFileAsync('images/2_screen_menubg_extended.png'),
                ribbon: preloadFileAsync('images/11_sprite_lba2.png'),
                ress: preloadFileAsync('data/RESS.HQR'),
                text: loadHqrAsync('TEXT.HQR'),
                voxgame: preloadFileAsync(`data/VOX/${_state.config.languageVoice.code}_GAM_AAC.VOX`),
                vox000: preloadFileAsync(`data/VOX/${_state.config.languageVoice.code}_000_AAC.VOX`),
                muslogo: preloadFileAsync('data/MUSIC/LOGADPCM.mp4'),
                mus15: preloadFileAsync('data/MUSIC/JADPCM15.mp4'),
                mus16: preloadFileAsync('data/MUSIC/JADPCM16.mp4'),
                musmenu: preloadFileAsync('data/MUSIC/Track6.mp4'),
                loadMenuText: loadTextsAsync(_state.config.language, 0),
                loadGameText: loadTextsAsync(_state.config.language, 4)
            }, function(err, files) {
                that.menuTexts = files.loadMenuText;
                that.texts = files.loadGameText;
                callback();
            });
        }
    };
}

function preloadFileAsync(url) {
    return (callback: Function) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            callback();
        };
        request.send();
    }
}
