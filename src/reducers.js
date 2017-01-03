/**
 * Reducers
 */
import {
  EDIT_MAP,
  ADD_COURSE,
  REMOVE_COURSE,
  TOGGLE_SECTION,
  SELECT_SEMESTER
} from './actions';
import {
  loadCoursesFromHistory,
  saveSemesterToHistory
} from './history';

function schedApp(state, action) {
  switch (action.type) {

    case ADD_COURSE:
      if (state.get('courses')
        .find(course =>
          course.get('dept') === action.dept && course.get('level') === action.level)) {
        return state;
      }

      state = state.updateIn(['courses'], Immutable.List(), list => list
        .push(Immutable.Map({
          dept: action.dept,
          level: action.level,
          sections: Immutable.List()
        }))
      );

      save(state);

      return state;


    case REMOVE_COURSE:
      state = state.updateIn(['courses'], Immutable.List(), list => list
        .filterNot(course =>
          course.get('dept') === action.dept && course.get('level') === action.level)
      );

      save(state);

      return state.set('selectedCourse', Immutable.Map());


    case TOGGLE_SECTION: {
      const courseIdx = state.get('courses')
        .findIndex(c => c.get('dept') === action.dept && c.get('level') === action.level);

      let course = state.getIn(['courses', courseIdx]);

      if (course.get('sections').find(section => section.get('number') === action.section)) {
        // if its already in there, remove it
        course = course.update('sections', Immutable.List(), list => list
          .filterNot(section => {
            // decrease color count
            if (section.get('number') === action.section) {
              state = state.updateIn(['colors', section.get('color')], 0, c => --c);
              return true;
            }
            return false;
          })
        );
      } else {
        // else, add it

        // choose color
        const color = getColor(state.get('colors'));
        state = state.updateIn(['colors', color], 1, c => ++c);

        course = course
          .update(
            'sections',
            Immutable.List(),
            list => list.push(Immutable.Map({ number: action.section, color }))
          );

        if (!state.getIn([
          'data',
          state.get('semester'),
          course.get('dept'),
          course.get('level'),
          action.section
        ]).has('building')) {
          // if we haven't geocoded this section before,
          // geocode it in the map worker
          // this is bad separation of concerns for the reducer
          const crn = state.getIn([
            'data',
            state.get('semester'),
            course.get('dept'),
            course.get('level'),
            action.section,
            'CRN'
          ]);

          window.mapWorker.postMessage({
            semester: state.get('semester'),
            dept: course.get('dept'),
            level: course.get('level'),
            section: action.section,
            crn
          });
        }
      }


      state = state.setIn(['courses', courseIdx], course);

      save(state);

      return state;
    }


    case SELECT_SEMESTER:
      // FIXME: bad side effect
      // the reducer should just be applying actions to state
      save(state);

      state = state.set('colors', Immutable.Map({
        '#fd7f7f': 0,
        '#adff8c': 0,
        '#ffc379': 0,
        '#71c1fd': 0,
        '#f7ff78': 0
      }));

      return state
        .set('semester', action.semester)
        .set('courses', Immutable.List());


    case EDIT_MAP:
      let d = action.data;

      // set building property of section
      state = state.setIn(
        ['data', state.get('semester'), d.dept, d.level, d.section, 'building'],
        d.building
      );

      // set coordinates of building in map data
      if (!state.get('map').has(d.building)) {
        state = state.setIn(['map', d.building], Immutable.Map(d.coords));
      }

      return state


    default:
      return state;

  }
}

export default schedApp;

/**
 * colors: <Immutable.Map>
 * {
 *    <hex color: string>: <uses: int>
 * }
 */
const getColor = colors => colors.entrySeq().min((a, b) => {
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
})[0];

/**
 * save a semester to localStorage
 */
function save(state) {
  saveSemesterToHistory(
    state.get('semester'),
    state.get('courses')
      .map(c => [
        c.get('dept'),
        c.get('level'),
        c.get('sections').map(s => s.get('number')).toArray()
      ]).toArray()
  );
}
