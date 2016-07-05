import React from 'react'; // TODO: remove in prod
import ReactDOM from 'react-dom'; // TODO: remove in prod
import Immutable from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './src/app';
import schedApp from './src/reducers';
import {
  addCourse
} from './src/actions';

/**
 * shape:
 * {
 *   courses: [
 *     {
 *       dept: <String>,
 *       level: <String>
 *       sections: [<String>]
 *     }
 *   ],
 *   selectedCourse: {
 *     dept: <String>,
 *     level: <String>
 *   }
 * }
 */

fetch('https://raw.githubusercontent.com/kelvinabrokwa/sched/gh-pages/data/data.json')
 .then(d => d.json())
 .then(data => {
   initializeApp(data);
 });

const initializeApp = data => {
  const store = createStore(schedApp, Immutable.fromJS({
    courses: [],
    data
  }));
  store.dispatch(addCourse('MATH', '451'));
  store.dispatch(addCourse('MATH', '351'));
  store.dispatch(addCourse('CSCI', '141'));
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
};
