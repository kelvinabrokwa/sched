import { connect } from 'react-redux';
import { addCourse, selectCourse } from '../actions';
import CourseSelect from '../components/course_select';

const mapStateToProps = state => ({
  data: state.get('data')
});

const mapDispatchToProps = dispatch => ({
  addCourse: (dept, level) => {
    dispatch(addCourse(dept, level));
    dispatch(selectCourse(dept, level));
  }
});

const CourseSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseSelect);

export default CourseSelectContainer;
