import {each, map} from 'lodash';

export function compileScripts(game, scene, actor) {
    compileScript('life', game, scene, actor);
    compileScript('move', game, scene, actor);
    actor.scripts.life.context.moveState = actor.scripts.move.context.state;
    actor.scripts.move.context.lifeState = actor.scripts.life.context.state;
}

function compileScript(type, game, scene, actor) {
    const script = actor.scripts[type];
    const state = {
        offset: 0,
        reentryOffset: 0,
        continue: true
    };
    script.context = {game, scene, actor, state, type};
    script.instructions = map(script.commands, (cmd, idx) => compileInstruction(script, cmd, idx + 1));
}

function compileInstruction(script, cmd, cmdOffset) {
    const args = [script.context];

    if (cmd.op.cmdState) {
        args.push({});
    }

    if (cmd.condition) {
        args.push(compileCondition(script, cmd));
    }

    if (cmd.operator) {
        args.push(compileOperator(cmd));
    }

    each(cmd.args, arg => {
        args.push(compileValue(script, arg, cmdOffset));
    });

    postProcess(script, cmd, cmdOffset, args);

    const callback = cmd.op.callback;
    return callback.bind.apply(callback, args);
}

function compileCondition(script, cmd) {
    return cmd.condition.op.callback.bind(script.context, compileValue(script, cmd.condition.param));
}

function compileOperator(cmd) {
    return cmd.operator.op.callback.bind(null, cmd.operator.operand);
}

function compileValue(script, value, cmdOffset) {
    if (!value)
        return undefined;

    switch (value.type) {
        case 'offset':
            if (script.opMap[value.value] == undefined) {
                console.warn(`Failed to parse offset: ${script.context.scene.index}:${script.context.actor.index}:${script.context.type}:${cmdOffset} offset=${value.value}`);
            }
            return script.opMap[value.value];
        case 'actor':
            return script.context.scene.getActor(value.value);
        default:
            return value.value;
    }
}

function postProcess(script, cmd, cmdOffset, args) {
    let opMap;
    switch (cmd.op.command) {
        case 'SET_TRACK':
            opMap = script.context.actor.scripts.move.opMap;
            if (opMap[args[1]] == undefined) {
                console.warn(`Failed to parse SET_TRACK offset: ${script.context.scene.index}:${script.context.actor.index}:${script.context.type}:${cmdOffset} offset=${args[1]}`);
            }
            args[1] = opMap[args[1]];
            break;
        case 'SET_TRACK_OBJ':
            opMap = args[1].scripts.move.opMap;
            if (opMap[args[2]] == undefined) {
                console.warn(`Failed to parse SET_TRACK_OBJ offset: ${script.context.scene.index}:${script.context.actor.index}:${script.context.type}:${cmdOffset} offset=${args[2]}`);
            }
            args[2] = opMap[args[2]];
            break;
        case 'SET_COMPORTEMENT_OBJ':
            opMap = args[1].scripts.life.opMap;
            if (opMap[args[2]] == undefined) {
                console.warn(`Failed to parse SET_COMPORTEMENT_OBJ offset: ${script.context.scene.index}:${script.context.actor.index}:${script.context.type}:${cmdOffset} offset=${args[2]}`);
            }
            args[2] = opMap[args[2]];
            break;
    }
}