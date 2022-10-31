import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { HashRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from './redux/authReducer';

const store = createStore(authReducer);
ReactDOM.render(
  <Provider>
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
