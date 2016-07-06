// import React from 'react'; // TODO: remove in prod
// import ReactDOM from 'react-dom'; // TODO: remove in prod
import Immutable from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './src/app';
import schedApp from './src/reducers';

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
 *   },
 *   data: {}
 * }
 */

fetch('https://raw.githubusercontent.com/kelvinabrokwa/sched/gh-pages/data/data.json')
 .then(d => d.json())
 .then(data => {
   initializeApp(data);
 });

const initializeApp = data => {
  const store = createStore(schedApp, Immutable.Map({
    courses: Immutable.List(parseURLOrHistory()
      .map(course => Immutable.Map({
        dept: course[0],
        level: course[1],
        sections: Immutable.List(course[2])
      }))),
    data: Immutable.fromJS(data)
  }));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
};

function parseURLOrHistory() {
  const query = window.location.href.split('q=');
  if (query.length > 1) {
    try {
      return JSON.parse(decodeURIComponent(query[1]));
    } catch (e) {
      console.log('Incorrect url format');
    }
  }
  if (localStorage.schedHistory) {
    return JSON.parse(localStorage.schedHistory);
  }
  return [];
}
