import { connect } from 'react-redux';
import { addSection, removeSection, toggleSection } from '../actions';
import SelectedCourse from '../components/selected_course';

const mapStateToProps = state => {
  const dept = state.getIn(['selectedCourse', 'dept']);
  const level = state.getIn(['selectedCourse', 'level']);
  if (!dept) return {};
  return {
    dept,
    level,
    sections: state.getIn(['data', dept, level]),
    selectedSections: state.get('courses').find(course =>
      course.get('dept') === dept && course.get('level') === level
    ).get('sections')
  };
};

const mapDispatchToProps = dispatch => ({
  onSectionAdd: (dept, level, section) => {
    dispatch(addSection(dept, level, section));
  },
  onSectionRemove: (dept, level, section) => {
    dispatch(removeSection(dept, level, section));
  },
  onSectionToggle: (dept, level, section) => {
    dispatch(toggleSection(dept, level, section));
  }
});

const SelectedCourseContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectedCourse);

export default SelectedCourseContainer;
