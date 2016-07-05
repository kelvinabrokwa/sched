import Immutable from 'immutable';
import { connect } from 'react-redux';
import Share from '../components/share';

const flattenSections = courses => courses
  .filter(course => course.get('sections').size > 0)
  .reduce((list, course) => {
    for (let i = 0; i < course.get('sections').size; i++) {
      list = list.push(Immutable.List([
        course.get('dept'),
        course.get('level'),
        course.getIn(['sections', i])
      ]));
    }
    return list;
  }, Immutable.List());

const mapStateToProps = state => ({
  courses: flattenSections(state.get('courses')).toJS()
});

const mapDispatchToProps = () => ({});

const ShareContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);

export default ShareContainer;
