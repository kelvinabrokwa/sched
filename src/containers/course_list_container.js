import { toggleSection, removeCourse } from '../actions';
import { connect } from 'react-redux';
import CourseList from '../components/course_list';

const mapStateToProps = state => ({
  courses: state.get('courses'),
  data: state.get('data')
});

const mapDispatchToProps = dispatch => ({
  onSectionToggle: (dept, level, section) => {
    dispatch(toggleSection(dept, level, section));
  },
  removeCourse: (dept, level) => {
    dispatch(removeCourse(dept, level));
  }
});

const CourseListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseList);

export default CourseListContainer;
