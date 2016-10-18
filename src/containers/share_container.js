import { connect } from 'react-redux';
import Share from '../components/share';

const mapStateToProps = state => {
  const courses = state.get('courses')
    .map(course => Immutable.List([
      course.get('dept'),
      course.get('level'),
      course.get('sections')
    ])).toJS();

  const semester = state.get('semester');

  const qs = `s=${semester}&q=${JSON.stringify(courses)}`;

  // udpate url
  if (history.pushState) {
    const url = `${window.location.protocol}//` +
      `${window.location.host}${window.location.pathname}?${qs}`;
    window.history.pushState({ path: url }, '', url);
  }

  // save to localStorage
  let oldHistory;
  const oldHistoryStr = localStorage.schedHistory;
  if (oldHistoryStr) {
    try {
      oldHistory = JSON.parse(oldHistoryStr);
    } catch (e) {
      console.log('Unable to parse localStorage history');
      console.log(oldHistoryStr);
      console.log(e);
      oldHistory = { schedules: {} };
    }
  } else {
    oldHistory = { schedules: {} };
  }

  localStorage.setItem('schedHistory', JSON.stringify({
    semester,
    schedules: Object.assign(
      oldHistory.schedules,
      { [semester]: courses }
    )
  }));

  return {
    queryString: qs
  };
};

const mapDispatchToProps = () => ({});

const ShareContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);

export default ShareContainer;
