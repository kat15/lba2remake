import React from 'react';
import DebugHUD from './ModelsArea/content';
import {Status} from './ModelsArea/status';
import {each, map, concat} from 'lodash';

const ModelsArea = {
    id: 'md',
    name: 'Models Editor',
    icon: 'game.png',
    content: DebugHUD,
    getInitialState: () => ({
        status: Status.NORMAL,
        slots: {macros: {}, expressions: []}
    }),
    stateHandler: {
        setStatus: function(status) {
            this.setState({status});
        },
        setSlots: function(slots) {
            this.setState({slots});
        }
    }
};

export default ModelsArea;
