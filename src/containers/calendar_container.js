import { connect } from 'react-redux';
import Calendar from '../components/calendar.js';
import { toggleSection } from '../actions';

const mapStateToProps = state => {
  // the courses props is an array of arrays
  // each array has [dept, level, section]
  const sections = state.get('courses')
    // filter out courses with no meet times
    .filter(course =>
      course.get('sections').size > 0 &&
      state.getIn([
        'data',
        state.get('semester'),
        course.get('dept'),
        course.get('level'),
        course.getIn(['sections', 0, 'number']),
        'meetings'
      ])
    )
    .reduce((list, course) => {
      for (let i = 0; i < course.get('sections').size; i++) {
        list.push({
          dept: course.get('dept'),
          level: course.get('level'),
          section: course.getIn(['sections', i])
        });
      }
      return list;
    }, []);

  return {
    sections,
    data: state.get('data'),
    semester: state.get('semester')
  };
};

const mapDispatchToProps = dispatch => ({
  toggleSection: (dept, level, section) => {
    dispatch(toggleSection(dept, level, section));
  }
});

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);

export default CalendarContainer;
