import React from 'react';
import {extend, map, isEmpty} from 'lodash';
import {execute} from './exprDSL/execute';
import FrameListener from '../../../utils/FrameListener';
import {Status} from './status';
import DebugData, {getObjectName} from '../../DebugData';
import {loadModel} from '../../../../model';
import * as THREE from 'three';

export default class Model extends FrameListener {

    constructor(props) {
        super(props);
        let that = this;
        const envInfo = {
            skyColor: [0, 0, 0],
            fogDensity: 0,
        };

        const scene = DebugData.scope.scene;
        const ambience = scene.data.ambience;
        const actor = scene.actors[0];
        const actorProps = actor.props;
        const params = this.props.params;
        this.updateModel = this.updateModel.bind(this);
        loadModel(params, actorProps.entityIndex, actorProps.bodyIndex, actorProps.animIndex, actor.animState, envInfo, ambience, (model) => {
            if (model !== null) {
                that.model = model;
                this.updateModel();
            }
        });
    }

    componentDidMount() {
        this.updateCanvas();
    }

    updateModel() {
        let renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        let scene = new THREE.Scene();

        scene.add(this.model.mesh);

        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.x = Math.cos(0) * 800;
        camera.position.z = Math.sin(0) * 800;
        camera.lookAt(scene.position);

        let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        let pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);

        renderer.render(scene, camera);
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
    }

    render() {
        return <div>
            <canvas width={300} height={100} ref={(canvas) => {
                this.canvas = canvas;
            }}/>
        </div>;
    }

    updateCanvas() {
        this.renderer.render( this.scene, this.camera );
    }

    frame() {
    }
}
