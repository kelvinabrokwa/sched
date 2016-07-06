import { connect } from 'react-redux';
import Immutable from 'immutable';
import Calendar from '../components/calendar.js';
import { removeSection } from '../actions';

const mapStateToProps = state => {
  const courses = state.get('courses')
    .filter(course =>
      course.get('sections').size > 0 &&
      state.getIn([
        'data',
        course.get('dept'),
        course.get('level'),
        course.getIn(['sections', 0]),
        'startTime'
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
    data: state.get('data').toJS()
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
