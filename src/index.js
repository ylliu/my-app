import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { HashRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import authReducer from './redux/authReducer';
import logger from 'redux-logger';

// const loggedInState = {
//   id: 1,
//   username: 'user1',
//   displayName: 'display1',
//   image: 'profile1.png',
//   password: 'P4ssword',
//   isLoggedIn: true
// };

const store = createStore(authReducer, applyMiddleware(logger));
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
