import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiOiJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';

class Map extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/kelvinabrokwa/cixau1odf00222pr2hlri2ify',
      center: [-76.711, 37.27],
      zoom: 15
    });

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('load', () => {
      this.map.addSource('buildings', {
        type: 'geojson',
        data: data2geoj(this.props.buildings)
      });

      this.map.addLayer({
        id: 'buildings',
        type: 'circle',
        source: 'buildings',
        paint: {
            'circle-radius': 8,
            'circle-color': '#f90000'
        },
      });

      this.map.on('mousemove', e => {
        var features = this.map.queryRenderedFeatures(e.point, { layers: ['buildings'] });
        if (!features.length) {
          this.popup.remove();
          return;
        }

        const feature = features[0];

        // FIXME
        feature.properties.courses = JSON.parse(feature.properties.courses);

        let div = `<div style='font-weight: bold'>${feature.properties.building}</div><div>`;

        for (let i = 0; i < feature.properties.courses.length; i++) {
          let c = feature.properties.courses[i];
          div += `<div>${c.dept} ${c.level} - ${c.section}</div>`;
        }

        div += '</div>';

        this.popup.setLngLat(feature.geometry.coordinates)
          .setHTML(div)
          .addTo(this.map);
      });
    });
  }

  componentWillReceiveProps(props) {
    if (this.map.loaded()) {
      this.map.getSource('buildings').setData(data2geoj(props.buildings));
    }
  }

  render() {
    return (<div style={{height: '300px'}}>
      <div ref='map' style={{position: 'absolute', width: '100%', height: '300px'}}></div>
    </div>);
  }

}

export default Map;

const data2geoj = data => {
  const features = [];

  for (let building in data) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [data[building][0].coords.lng, data[building][0].coords.lat]
      },
      properties: {
        building,
        courses: data[building]
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features
  };
}
