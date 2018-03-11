import React from 'react';
import {extend, map, isEmpty} from 'lodash';
import {execute} from './exprDSL/execute';
import autoComplete from './exprDSL/autocomplete';
import FrameListener from '../../../utils/FrameListener';
import {addSlot} from './slots';
import Expression from './../DebugHUDArea/Expression';
import {Status} from './status';
import DebugData from '../../DebugData';
import {editor as editorStyle} from "../../../styles";
import {loadModel} from '../../../../model';

const sectionStyle = {
    paddingBottom: 10
};

export default class DebugHUD extends FrameListener {
    constructor(props) {
        super(props);

        this.addExpression = this.addExpression.bind(this);
        this.inputKeyDown = this.inputKeyDown.bind(this);

        let expr = "scene.actors[0]", //twinsen
        slots = this.props.sharedState.slots;
        if (expr && addSlot(slots, expr)) {
            this.props.stateHandler.setSlots(slots);
            this.state = {
                completion: autoComplete('', DebugData.scope),
                values: []
            };
        }
        expr = "scene.actors[0].animState"; //twinsen
        slots = this.props.sharedState.slots;
        if (expr && addSlot(slots, expr)) {
            this.props.stateHandler.setSlots(slots);
            this.state = {
                completion: autoComplete('', DebugData.scope),
                values: []
            };
        }
        const envInfo = {
            skyColor: [0, 0, 0],
            fogDensity: 0,
        };
        const ambience = {
            lightingAlpha: 414,
            lightingBeta: 136
        };
        let bodyIdx = 0,
            animIdx = 0;
        console.log(slots.expressions[0].index);
    }

    componentDidMount() {
        this.updateCanvas();
    }

    render() {
        const slots = this.props.sharedState.slots;
        const expressions = map(slots.expressions, (expr, idx) => {
            return <div key={expr.expr}>
                <button style={editorStyle.button} onClick={this.removeExpression.bind(this, idx)}>-</button>
                <Expression expr={expr} value={this.state.values[idx]} addExpression={this.addExpression}/>
            </div>;
        });
        return <div>
            <canvas ref="canvas" width={300} height={100}/>
            {expressions.length > 0
                ? <div style={sectionStyle}>{expressions}</div>
                : null}
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

    inputKeyDown(event) {
        event.stopPropagation();
        const key = event.code || event.which || event.keyCode;
        const completion = autoComplete(this.input.value, DebugData.scope);
        this.setState({completion});
        if (key === 'Enter' || key === 13) {
            this.addExpression();
            event.preventDefault();
        } else if (key === 'Tab' || key === 9) {
            if (completion.length > 0) {
                this.input.value = completion[0];
            }
            event.preventDefault();
        }
    }

    addExpression(expr = this.input.value) {
        const slots = this.props.sharedState.slots;
        if (expr && addSlot(slots, expr)) {
            if (expr === this.input.value) {
                this.input.value = '';
                this.props.stateHandler.setSlots(slots);
                this.setState({completion: autoComplete('', DebugData.scope)});
            }
        }
    }

    removeExpression(index) {
        const slots = this.props.sharedState.slots;
        delete slots.expressions.splice(index, 1);
        this.props.stateHandler.setSlots(slots);
    }
}
