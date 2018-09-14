import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

require('./scss/index.scss');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
