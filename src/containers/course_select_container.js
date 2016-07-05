import { connect } from 'react-redux';
import { addCourse } from '../actions';
import CourseSelect from '../components/course_select';

const mapStateToProps = state => ({
  data: state.get('data')
});

const mapDispatchToProps = dispatch => ({
  addCourse: (dept, level) => {
    dispatch(addCourse(dept, level));
  }
});

const CourseSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseSelect);

export default CourseSelectContainer;
