import { connect } from 'react-redux';
import Map from '../components/map';
import { editMap } from '../actions';

const mapStateToProps = state => {
  return {
    semester: state.get('semester'),
    courses: state.get('courses').toJS(),
    data: state.get('data'),
    buildings: state.get('map').toJS() // building coordinates
  };
};

const mapDispatchToProps = dispatch => ({});

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;
