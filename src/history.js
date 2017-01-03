/**
 * This file defines methods that handle persisting data
 * and url encoded schedules
 */
import URLSearchParams from 'url-search-params';


/**
 * Parse the url or localStorage for a schedule
 */
export function parseURLOrHistory() {
  let semester, schedule;
  const params = new URLSearchParams(location.search.slice(1));
  if (params.has('s')) {
    semester = params.get('s');
    if (params.has('q')) {
      try {
        schedule = JSON.parse(decodeURIComponent(params.get('q')));
      } catch (e) {
        console.log('Incorrect url format');
        console.log(params.get('q'));
        console.log(e);
        schedule = [];
      }
    }
  } else if (localStorage.schedHistory) {
    try {
      const schedHistory = JSON.parse(localStorage.schedHistory);
      semester = schedHistory.semester;
      schedule = schedHistory.schedules[semester];
    } catch (e) {
      console.log('Could not parse history from localstorage');
      console.log(e);
      console.log('Deleting localStorage');
      delete localStorage.schedHistory;
      semester = null;
      schedule = [];
    }
  } else {
    semester = null;
    schedule = [];
  }
  return { semester, schedule };
}


/**
 * Given a semester, return its course history
 * from localStorage if available
 */
export function loadCoursesFromHistory(semester) {
  let schedHistory;
  if (localStorage.schedHistory) {
    try {
      schedHistory = JSON.parse(localStorage.schedHistory);
    } catch (e) {
      console.log('Could not load history');
      console.log(localStorage.schedHistory);
      console.log(e);
      console.log('Deleting localStorage');
      delete localStorage.schedHistory;
      return [];
    }
  }
  if (semester in schedHistory.schedules)
    return schedHistory.schedules[semester];

  return [];
}

export function saveSemesterToHistory(semester, courses) {
  let history;
  const historyStr = localStorage.schedHistory;
  if (historyStr) {
    try {
      history = JSON.parse(historyStr);
    } catch (e) {
      console.log('Unable to parse localStore history');
      console.log(historyStr);
      console.log(e);
      history = {};
    }
  } else {
    history = { schedules: {} };
  }

  localStorage.setItem('schedHistory', JSON.stringify({
    semester,
    schedules: Object.assign(history.schedules, { [semester]: courses })
  }));
}
