import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-147950989-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
