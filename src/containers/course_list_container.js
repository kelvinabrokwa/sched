import { selectCourse } from '../actions';
import { connect } from 'react-redux';
import CourseList from '../components/course_list';

const mapStateToProps = state => ({
  courses: state.get('courses')
});

const mapDispatchToProps = dispatch => ({
  onCourseClick: (dept, level) => {
    dispatch(selectCourse(dept, level));
  }
});

const CourseListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseList);

export default CourseListContainer;
