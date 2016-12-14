import { connect } from 'react-redux';
import Calendar from '../components/calendar.js';
import { removeSection } from '../actions';

const mapStateToProps = state => {
  // the courses props is an array of arrays
  // each array has [dept, level, section]
  const courses = state.get('courses')
    // filter out courses with no meet times
    .filter(course =>
      course.get('sections').size > 0 &&
      state.getIn([
        'data',
        state.get('semester'),
        course.get('dept'),
        course.get('level'),
        course.getIn(['sections', 0]),
        'meetings'
      ])
    )
    .reduce((list, course) => {
      for (let i = 0; i < course.get('sections').size; i++) {
        list = list.push(Immutable.List([
          course.get('dept'),
          course.get('level'),
          course.getIn(['sections', i])
        ]));
      }
      return list;
    }, Immutable.List());
  return {
    courses: courses.toJS(),
    data: state.get('data').toJS(),
    semester: state.get('semester')
  };
};

const mapDispatchToProps = dispatch => ({
  removeSection: (dept, level, section) => {
    dispatch(removeSection(dept, level, section));
  }
});

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);

export default CalendarContainer;
