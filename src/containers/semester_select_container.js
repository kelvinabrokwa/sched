import { connect } from 'react-redux';
import { selectSemester } from '../actions';
import SemesterSelect from '../components/semester_select';

const mapStateToProps = state => ({
  semester: state.get('semester'),
  data: state.get('data')
});

const mapDispatchToProps = dispatch => ({
  selectSemester: e => {
    dispatch(selectSemester(e.target.value));
  }
});

const SemesterSelectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SemesterSelect);

export default SemesterSelectContainer;
