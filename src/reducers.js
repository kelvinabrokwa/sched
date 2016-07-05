import Immutable from 'immutable';
import {
  ADD_COURSE,
  REMOVE_COURSE,
  ADD_SECTION,
  REMOVE_SECTION,
  TOGGLE_SECTION,
  SELECT_COURSE
} from './actions';

function schedApp(state, action) {
  switch (action.type) {
    case ADD_COURSE:
      return state.updateIn(['courses'], Immutable.List(), list => list.push(Immutable.Map({
        dept: action.dept,
        level: action.level,
        sections: Immutable.List()
      })));
    case REMOVE_COURSE:
      return state.updateIn(['courses'], Immutable.List(), list => list
        .filterNot(course =>
          course.get('dept') === action.dept && course.get('level') === action.level)
      );
    case ADD_SECTION:
      break;
    case REMOVE_SECTION:
      console.log(action);
      break;
    case TOGGLE_SECTION: {
      const courseIdx = state.get('courses')
        .findIndex(c => c.get('dept') === action.dept && c.get('level') === action.level);
      let course = state.getIn(['courses', courseIdx]);
      if (course.get('sections').find(section => section === action.section)) {
        course = course.updateIn(['sections'], Immutable.List(), list => list
          .filterNot(section => section === action.section)
        );
      } else {
        course = course.updateIn(['sections'], Immutable.List(), list => list.push(action.section));
      }
      return state.setIn(['courses', courseIdx], course);
    }
    case SELECT_COURSE:
      return state.set('selectedCourse', Immutable.Map({
        dept: action.dept,
        level: action.level
      }));
    default:
      return state;
  }
  return state;
}

export default schedApp;