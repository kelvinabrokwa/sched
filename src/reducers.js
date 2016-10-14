import {
  ADD_COURSE,
  REMOVE_COURSE,
  REMOVE_SECTION,
  TOGGLE_SECTION
} from './actions';

function schedApp(state, action) {
  switch (action.type) {

    case ADD_COURSE:
      if (state.get('courses')
        .find(course =>
          course.get('dept') === action.dept && course.get('level') === action.level)) {
        return state;
      }
      return state.updateIn(['courses'], Immutable.List(), list => list
        .push(Immutable.Map({
          dept: action.dept,
          level: action.level,
          sections: Immutable.List()
        }))
      );

    case REMOVE_COURSE:
      state = state.updateIn(['courses'], Immutable.List(), list => list
        .filterNot(course =>
          course.get('dept') === action.dept && course.get('level') === action.level)
      );

      return state.set('selectedCourse', Immutable.Map());

    case REMOVE_SECTION:
      const courseIdx = state.get('courses')
        .findIndex(c => c.get('dept') === action.dept && c.get('level') === action.level);
      let course = state.getIn(['courses', courseIdx]);
      course = course.updateIn(['sections'], Immutable.List(), list => list
        .filterNot(section => section === action.section)
      );
      return state.setIn(['courses', courseIdx], course);

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

    default:
      return state;

  }
}

export default schedApp;
