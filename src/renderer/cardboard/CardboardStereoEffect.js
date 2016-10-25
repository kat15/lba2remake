"use strict";

import THREE from 'three';
import {getProjectionMatrixPair} from './CardboardView';

export default function CardboardStereoEffect(cardboard_view, scene, camera, eyeDistanceDivider, overrideMaterial, clearColor, clearAlpha) {

    this.cardboard_view = cardboard_view;
    this.scene = scene;
    this.camera = camera;

    this.overrideMaterial = overrideMaterial;

    this.clearColor = clearColor;
    this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

    this.oldClearColor = new THREE.Color();
    this.oldClearAlpha = 1;

    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;

    // Stereo
    var scope = this;

    this.eyeSeparation = cardboard_view.device.inter_lens_distance;

    Object.defineProperties(this, {
        separation: {
            get: function () {
                return scope.eyeSeparation;
            },
            set: function (value) {
                console.warn('THREE.StereoEffect: .separation is now .eyeSeparation.');
                scope.eyeSeparation = value;
            }
        },
        targetDistance: {
            get: function () {
                return scope.focalLength;
            },
            set: function (value) {
                console.warn('THREE.StereoEffect: .targetDistance is now .focalLength.');
                scope.focalLength = value;
            }
        }
    });

    // internals

    var _position = new THREE.Vector3();
    var _quaternion = new THREE.Quaternion();
    var _scale = new THREE.Vector3();

    var _cameraL = new THREE.PerspectiveCamera();
    var _cameraR = new THREE.PerspectiveCamera();

    this.render = function (renderer, writeBuffer, readBuffer, delta) {
        var _width = readBuffer.width / 2;
        var _height = readBuffer.height;

        this.scene.overrideMaterial = this.overrideMaterial;

        if (this.clearColor) {
            this.oldClearColor.copy(renderer.getClearColor());
            this.oldClearAlpha = renderer.getClearAlpha();

            renderer.setClearColor(this.clearColor, this.clearAlpha);
        }

        // begin StereoEffect
        this.scene.updateMatrixWorld();
        this.camera.updateMatrixWorld();

        this.camera.matrixWorld.decompose(_position, _quaternion, _scale);

        this.eyeSeparation = this.cardboard_view.device.inter_lens_distance / (eyeDistanceDivider || 1.0);

        var projections = getProjectionMatrixPair(this.cardboard_view.getLeftEyeFov(), this.camera.near, this.camera.far);

        // left
        _cameraL.projectionMatrix.copy(projections.left);
        _cameraL.position.copy(_position);
        _cameraL.quaternion.copy(_quaternion);
        _cameraL.translateX(-this.eyeSeparation / 2.0);

        // right
        _cameraR.projectionMatrix.copy(projections.right);
        _cameraR.position.copy(_position);
        _cameraR.quaternion.copy(_quaternion);
        _cameraR.translateX(this.eyeSeparation / 2.0);

        renderer.clear();
        renderer.setScissorTest(true);

        // Viewport can be changed during setRenderTarget call
        // (which gets called from render() function).  Bug?
        renderer.setRenderTarget(readBuffer);

        readBuffer.scissor.set(0, 0, _width, _height);
        readBuffer.viewport.set(0, 0, _width, _height);
        renderer.render(this.scene, _cameraL, readBuffer, true);

        readBuffer.scissor.set(_width, 0, _width, _height);
        readBuffer.viewport.set(_width, 0, _width, _height);
        renderer.render(this.scene, _cameraR, readBuffer, false);

        renderer.setViewport(0, 0, 2 * _width, _height);

        renderer.setScissorTest(false);
        // end StereoEffect

        if (this.clearColor) {
            renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
        }

        this.scene.overrideMaterial = null;
    };
};
