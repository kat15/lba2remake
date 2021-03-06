import React from 'react';
import DebugData from '../../../../DebugData';

function goto(index) {
    if (DebugData.sceneManager) {
        DebugData.sceneManager.goto(index);
    }
}

function isSelected(index) {
    const scene = DebugData.scope.scene;
    if (scene) {
        return scene.index === index;
    }
    return false;
}

const indirectSceneColor = '#AAAAAA';

function scene(type, index, name, children) {
    const icon = `editor/icons/locations/${type}.png`;
    if (index === -1) {
        return {name, type, children, icon, color: indirectSceneColor};
    } else {
        return {
            name,
            type,
            onClick: goto.bind(null, index),
            children: children ? children : [],
            props: [
                {
                    id: 'index',
                    value: index,
                    render: (value) => `#${value}`
                }
            ],
            selected: isSelected.bind(null, index),
            icon
        };
    }
}

export const island = scene.bind(null, 'island');
export const section = scene.bind(null, 'section');
export const iso = scene.bind(null, 'building');

export function planet(name, icon, children) {
    return {
        type: 'planet',
        name: name,
        color: indirectSceneColor,
        children,
        icon: `editor/icons/locations/${icon}.png`
    };
}
