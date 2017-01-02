//import React from 'react'; // TODO: remove in prod
//import ReactDOM from 'react-dom'; // TODO: remove in prod
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './src/app';
import Loading from './src/loading';
import schedApp from './src/reducers';
import { parseURLOrHistory } from './src/history';
import { editMap, addCourse, toggleSection } from './src/actions';

/**
 * Store format:
 * {
 *   courses: [
 *     {
 *       dept: <String>,
 *       level: <String>
 *       sections: [ { number: <String>, color: <String> }]
 *     }
 *   ],
 *   data: {
 *     semester: {
 *       dept: {
 *         level: {
 *           section: {}
 *         }
 *       }
 *     }
 *   },
 *   semester: <String>,
 *   map: { building: { lng: <Number>, lat: <Number> } }
 * }
 */

ReactDOM.render(
  <Loading />,
  document.getElementById('app')
);

if (window.Worker) {
  var dataFetchWorker = new Worker('data_fetch_worker.js');
  dataFetchWorker.onmessage = e => {
    initializeApp(e.data);
  }
  window.mapWorker = new Worker('map_worker.js')
}

const initializeApp = data => {
  const history = parseURLOrHistory();
  let { semester, schedule } = history;

  if (!semester || Object.keys(data).indexOf(semester) === -1) {
    semester = Object.keys(data)[0];
    schedule = [];
  }

  const store = createStore(schedApp, Immutable.Map({
    courses: Immutable.List(),
    data: Immutable.fromJS(data),
    map: Immutable.Map({}),
    colors: Immutable.Map({
      '#fd7f7f': 0,
      '#adff8c': 0,
      '#ffc379': 0,
      '#71c1fd': 0,
      '#f7ff78': 0
    }),
    semester
  }));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );

  for (let i = 0; i < schedule.length; i++) {
    let course = schedule[i];
    store.dispatch(addCourse(course[0], course[1]));
    for (let j = 0; j < course[2].length; j++) {
      store.dispatch(toggleSection(course[0], course[1], course[2][j]));
    }
  }

  if (window.Worker) {
    window.mapWorker.onmessage = e => {
      store.dispatch(editMap(e.data));
    };
  }
};

