import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import registerServiceWorker from './registerServiceWorker';
import allReducers from './reducers';
import App from './components/App';
import Confirm from './components/Confirm';

import './style/index.css';

// Create a Redux store holding the state of your app.
const store = createStore(allReducers);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="app">
        <Route exact path="/" component={App} />
        <Route path="/kiitos" component={Confirm} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
//registerServiceWorker();
