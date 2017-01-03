/**
 * Map component
 */
import bbox from '@turf/bbox';

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
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.scrollZoom.disable();
    this.map.doubleClickZoom.disable();

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('load', () => {
      const geoj = props2geoj(this.props);

      this.map.addSource('buildings', {
        type: 'geojson',
        data: geoj
      });


      this.map.addLayer({
        id: 'buildings',
        type: 'circle',
        source: 'buildings',
        paint: {
            'circle-radius': 10,
            'circle-color': {
              property: 'color',
              type: 'identity'
            }
        },
      });

      this.repositionMap(geoj);

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
      const geoj = props2geoj(props);
      this.map.getSource('buildings').setData(geoj);
      this.repositionMap(geoj);
    }
  }

  repositionMap(geoj) {
    if (geoj.features.length == 1) {
      this.map.setCenter(geoj.features[0].geometry.coordinates);
      this.map.setZoom(15);
    } else if (geoj.features.length > 1) {
      this.map.fitBounds(bbox(geoj), { padding: 40 });
    }

  }

  render() {
    return (<div style={{ height: '300px' }} className='border-bottom-blue'>
      <div ref='map' style={{ position: 'absolute', width: '100%', height: '300px' }}>
        <div
          className='pad2'
          style={{
            position: 'absolute',
            zIndex: 1,
            fontSize: '50px',
            color: 'rgba(0,0,0,0.7)',
            backgroundColor: 'rgba(255,255,255,0.8)'
          }}>sched</div>
      </div>
    </div>);
  }

}

export default Map;

function props2geoj(p) {
  const buildings = {};

  for (let i = 0; i < p.courses.size; i++) {
    let c = p.courses.get(i);

    for (let j = 0; j < c.get('sections').size; j++) {
      let building = p.data.getIn([
        p.semester,
        c.get('dept'),
        c.get('level'),
        c.getIn(['sections', j, 'number']),
        'building'
      ]);

      if (!building) {
        // this section is still being geocoded by the worker
        // skip mapping it
        continue;
      }

      if (!(building in buildings)) {
        buildings[building] = {
          sections: [],
          coords: p.buildings.getIn([building, 'coords']),
          color: c.getIn(['sections', j, 'color'])
        };
      }

      buildings[building].sections.push({
        dept: c.get('dept'),
        level: c.get('level'),
        section: c.getIn(['sections', j, 'number'])
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
          sections: buildings[b].sections,
          color: buildings[b].color
        }
      }))
  };
}

