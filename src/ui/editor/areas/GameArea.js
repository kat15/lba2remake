import React from 'react';
import Game from '../../Game';
import {clone} from 'lodash';
import ScriptEditorArea from './ScriptEditorArea';
import DebugHUDArea from './DebugHUDArea';
import {SceneOutliner, Locator} from './OutlinerArea';
import {GameMenu} from "./GameArea/menu";
import {Orientation, Type} from '../layout';
import ModelsArea from "./ModelsArea";

const GameArea = {
    id: 'game',
    name: 'Gameplay Editor',
    menu: GameMenu,
    content: Game,
    icon: 'game.png',
    mainArea: true,
    getInitialState: () => ({
        labels: {
            actor: false,
            zone: false,
            point: false
        }
    }),
    stateHandler: {
        setLabel: function (type, value) {
            const labels = clone(this.state.labels);
            labels[type] = value;
            this.setState({labels});
        }
    },
    toolAreas: [
        ScriptEditorArea,
        DebugHUDArea,
        ModelsArea,
        SceneOutliner,
        Locator
    ],
    defaultLayout: {
        type: Type.LAYOUT,
        orientation: Orientation.HORIZONTAL,
        splitAt: 60,
        children: [
            {
                type: Type.LAYOUT,
                orientation: Orientation.VERTICAL,
                splitAt: 70,
                children: [
                    { type: Type.AREA, content_id: 'game', root: true },
                    { type: Type.AREA, content_id: 'script_editor' },
                    { type: Type.AREA, content_id: 'changelog' }
                ]
            },
            {
                type: Type.LAYOUT,
                orientation: Orientation.VERTICAL,
                splitAt: 70,
                children: [
                    {
                        type: Type.LAYOUT,
                        orientation: Orientation.VERTICAL,
                        splitAt: 50,
                        children: [
                            { type: Type.AREA, content_id: 'scene_outliner' },
                            { type: Type.AREA, content_id: 'locator' }
                        ]
                    },
                    { type: Type.AREA, content_id: 'dbg_hud' }
                ]
            }
        ]
    }
};

export default GameArea;
