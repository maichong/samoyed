import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as H from 'history';
import app from '@samoyed/app';
import App from './App';
import '@samoyed/card-layout';
import '../scss/index.scss';

const history = H.createHashHistory();

// @ts-ignore
window.h = history;

app.init();
app.history = history;

ReactDOM.render(
  <App />
  , document.getElementById('app')
);
