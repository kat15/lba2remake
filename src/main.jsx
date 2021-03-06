import React from 'react';
import ReactDOM from 'react-dom';

import Ticker from './ui/utils/Ticker';
import Game from './ui/Game';
import Editor from './ui/Editor';
import Popup from './ui/Popup';
import {loadParams} from './params';
import {loadGameMetaData} from './ui/editor/DebugData';

class Root extends React.Component {
    constructor(props) {
        super(props);
        const params = loadParams();
        this.state = { params };
        this.onHashChange = this.onHashChange.bind(this);
        if (params.editor) {
            loadGameMetaData();
        }
    }

    componentWillMount() {
        window.addEventListener('hashchange', this.onHashChange);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.onHashChange);
    }

    onHashChange() {
        this.setState({ params: loadParams() });
    }

    render() {
        let content;
        if (this.state.params.editor) {
            content = <Editor params={this.state.params} ticker={this.props.ticker} />;
        } else {
            content = <Game params={this.state.params} ticker={this.props.ticker} />;
        }
        return <div>
            {content}
            <Popup/>
        </div>
    }
}

window.onload = function() {
    const ticker = new Ticker();
    ReactDOM.render(<Root ticker={ticker}/>, document.getElementById('root'));
    ticker.run();
};
