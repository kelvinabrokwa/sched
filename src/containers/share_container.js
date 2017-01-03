import { connect } from 'react-redux';
import Share from '../components/share';

const mapStateToProps = state => {
  // TODO: this is done elsewhere, just save it and reuse
  const courses = state.get('courses')
    .map(course => [
      course.get('dept'),
      course.get('level'),
      course.get('sections').map(section => section.get('number'))
    ]);

  const semester = state.get('semester');

  const qs = `s=${semester}&q=${JSON.stringify(courses)}`;

  // udpate url
  if (history.pushState) {
    const url = `${window.location.protocol}//` +
      `${window.location.host}${window.location.pathname}?${qs}`;
    window.history.pushState({ path: url }, '', url);
  }

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
