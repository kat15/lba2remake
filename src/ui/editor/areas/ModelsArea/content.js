import React from 'react';
import {extend, map, isEmpty} from 'lodash';
import {execute} from './exprDSL/execute';
import FrameListener from '../../../utils/FrameListener';
import {Status} from './status';
import DebugData, {getObjectName} from '../../DebugData';
import {loadModel} from '../../../../model';

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
        loadModel(params, actorProps.entityIndex, actorProps.bodyIndex, actorProps.animIndex, actor.animState, envInfo, ambience, (model) => {
            if (model !== null) {
                that.model = model;
                console.log(model);
            }
        });
    }

    componentDidMount() {
        this.updateCanvas();
    }

    render() {
        return <div>
            <canvas ref="canvas" width={300} height={100}/>
        </div>;
    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillRect(0, 0, 100, 100);
    }

    frame() {
        if (this.props.sharedState.status === Status.NORMAL) {
            const slots = this.props.sharedState.slots;
            const {macros, expressions} = slots;
            const values = map(expressions, expr => {
                try {
                    return {value: execute(expr.program, [DebugData.scope], macros)};
                }
                catch (error) {
                    return {error};
                }
            });
            this.setState({values});
        }
    }
}
