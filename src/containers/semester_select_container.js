import { connect } from 'react-redux';
import { selectSemester, addCourse, toggleSection } from '../actions';
import SemesterSelect from '../components/semester_select';
import { loadCoursesFromHistory } from '../history';

const mapStateToProps = state => ({
  semester: state.get('semester'),
  data: state.get('data')
});

const mapDispatchToProps = dispatch => ({
  selectSemester: e => {
    // change semester
    dispatch(selectSemester(e.target.value));

    // load courses for this semester from history
    const courses = loadCoursesFromHistory(e.target.value);
    for (let i = 0; i < courses.length; i++) {
      let c = courses[i];
      dispatch(addCourse(c[0], c[1]));
      for (let j = 0; j < c[2].length; j++) {
        dispatch(toggleSection(c[0], c[1], c[2][j]));
      }
    }
  }
});

const SemesterSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SemesterSelect);

export default SemesterSelectContainer;
