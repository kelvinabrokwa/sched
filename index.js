//import React from 'react'; // TODO: remove in prod
//import ReactDOM from 'react-dom'; // TODO: remove in prod
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './src/app';
import Loading from './src/loading';
import schedApp from './src/reducers';
import { parseURLOrHistory } from './src/history';
import { editMap } from './src/actions';

/**
 * Store format:
 * {
 *   courses: [
 *     {
 *       dept: <String>,
 *       level: <String>
 *       sections: [<String>]
 *     }
 *   ],
 *   data: {},
 *   semester: <String>
 * }
 */

ReactDOM.render(
  <Loading/>,
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
  let { semester } = history;
  let { schedule } = history;

  if (!semester || Object.keys(data).indexOf(semester) === -1) {
    semester = Object.keys(data)[0];
    schedule = [];
  }

  const store = createStore(schedApp, Immutable.Map({
    courses: Immutable.List(schedule
      .map(course => Immutable.Map({
        dept: course[0],
        level: course[1],
        sections: Immutable.List(course[2])
      }))),
    data: Immutable.fromJS(data),
    map: Immutable.Map({}),
    semester
  }));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );

  if (window.Worker) {
    window.mapWorker.onmessage = e => {
      store.dispatch(editMap(e.data));
    };

    for (let i = 0; i < schedule.length; i++) {
      for (let j = 0; j < schedule[i][2].length; j++) {
        const dept = schedule[i][0];
        const level = schedule[i][1];
        const section = schedule[i][2][j];
        const crn = data[semester][dept][level][section]['CRN'];
        window.mapWorker.postMessage({ semester, dept, level, section, crn });
      }
    }
  }
};

