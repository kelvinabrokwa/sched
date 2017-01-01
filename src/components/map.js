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

    this.map.scrollZoom.disable();
    this.map.doubleClickZoom.disable();

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('load', () => {
      this.map.addSource('buildings', {
        type: 'geojson',
        data: props2geoj(this.props)
      });

      this.map.addLayer({
        id: 'buildings',
        type: 'circle',
        source: 'buildings',
        paint: {
            'circle-radius': 8,
            'circle-color': '#fd7f7f'
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
        feature.properties.sections = JSON.parse(feature.properties.sections);

        let div = `<div style='font-weight: bold'>${feature.properties.building}</div><div>`;

        for (let i = 0; i < feature.properties.sections.length; i++) {
          let c = feature.properties.sections[i];
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
      this.map.getSource('buildings').setData(props2geoj(props));
    }
  }

  render() {
    return (<div style={{height: '300px'}} className='border-bottom-blue'>
      <div ref='map' style={{position: 'absolute', width: '100%', height: '300px'}}></div>
    </div>);
  }

}

export default Map;

function props2geoj(p) {
  const buildings = {};

  for (let i = 0; i < p.courses.size; i++) {
    let c = p.courses.get(i);
    for (let j = 0; j < c.get('sections').size; j++) {
      let building = p.data.getIn([p.semester, c.get('dept'), c.get('level'), c.getIn(['sections', j]), 'building']);

      if (!building) {
        // this section is still being geocoded by the worker
        // skip mapping it
        continue;
      }

      if (!(building in buildings)) {
        buildings[building] = {
          sections: [],
          coords: p.buildings.getIn([building, 'coords'])
        };
      }

      buildings[building].sections.push({
        dept: c.get('dept'),
        level: c.get('level'),
        section: c.getIn(['sections', j])
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features: Object.keys(buildings)
      .map(b => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.buildings.getIn([b, 'lng']), p.buildings.getIn([b, 'lat'])]
        },
        properties: {
          building: b,
          sections: buildings[b].sections
        }
      }))
  };
}

