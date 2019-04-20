import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';

import routes from 'routes';
import stores from 'stores';

import './theme/main.styl';

const some = require('./main');
// process.env.NODE_ENV !== 'production';
const history = createBrowserHistory();

function App() {
    return (
        <Provider {...stores}>
            <Router history={history}>
                <Switch>
                    {routes.map(props => <Route key={props.path} {...props} />)}

                    <Route component={() => <div>Not found page</div>} />
                </Switch>
            </Router>
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
