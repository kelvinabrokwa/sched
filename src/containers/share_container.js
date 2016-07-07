import { connect } from 'react-redux';
import Share from '../components/share';

const mapStateToProps = state => {
  const courses = JSON.stringify(state.get('courses')
    .map(course => Immutable.List([
      course.get('dept'),
      course.get('level'),
      course.get('sections')
    ])).toJS());
  const qs = `q=${courses}`;
  if (history.pushState) {
    const url = `${window.location.protocol}//` +
      `${window.location.host}${window.location.pathname}?${qs}`;
    window.history.pushState({ path: url }, '', url);
  }
  localStorage.setItem('schedHistory', courses);
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
