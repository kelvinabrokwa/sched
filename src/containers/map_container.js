import { connect } from 'react-redux';
import Map from '../components/map';
import { editMap } from '../actions';

const mapStateToProps = state => {
  return { buildings: state.get('map').toJS() };
};

const mapDispatchToProps = dispatch => ({});

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;
