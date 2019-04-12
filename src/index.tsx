import * as ReactDOM from 'react-dom';
import * as React from 'react';
import app from '@samoyed/app';
import App from './App';
import '../scss/index.scss';

app.init();

ReactDOM.render(
  <App />
  , document.getElementById('app')
);
