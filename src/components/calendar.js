import { colors, oclock } from '../utils';


class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: []
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    // setup
    this.rectWidth = 90;
    const calWidth = 700;
    const calHeight = 650;
    const pad = 15;

    this.svg = d3.select('#calendar').append('svg')
        .attr('width', calWidth)
        .attr('height', calHeight)
      .append('g')
        .attr('transform', `translate(${pad},${pad})`);

    this.gridArea = this.svg.append('g')
      .attr('transform', 'translate(50, 20)');

    // grid lines
    this.gridArea.append('g').selectAll('line')
      .data(d3.range(0, 16))
      .enter().append('line')
        .attr('x1', 0)
        .attr('x2', calWidth)
        .attr('y1', h => h * 40)
        .attr('y2', h => h * 40)
        .attr('class', 'line');

    // grid shading
    this.gridArea.append('g').selectAll('rect')
      .data(d3.range(0, 8))
      .enter().append('rect')
        .attr('x', 0)
        .attr('y', h => h * 80)
        .attr('width', calWidth)
        .attr('height', 40)
        .style('opacity', 0.05);

    // day axis
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.svg.append('g').selectAll('text')
      .data(days)
      .enter().append('text')
        .attr('x', (d, i) => i * 125)
        .attr('y', 0)
        .text(d => d)
          .attr('class', 'anchor-middle')
          .attr('transform', 'translate(110, 0)');

    // time axis
    const offset = 4;
    this.svg.append('g').selectAll('text')
      .data(d3.range(7, 23))
      .enter().append('text')
        .attr('x', 0)
        .attr('y', v => (v - 7) * 40 + offset)
        .text(oclock)
        .attr('transform', 'translate(0, 20)');

    // scales
    const xScale = this.xScale = d3.scale.linear()
      .domain([0, 4])
      .range([0, 500]);
    this.x = course => {
      const i = ['M', 'T', 'W', 'R', 'F'].indexOf(course.meetDay);
      return xScale(i);
    };

    const t7am = moment()
      .startOf('day')
      .hours(7)
      .subtract(moment().startOf('day').valueOf(), 'ms')
      .valueOf();
    const t10pm = moment()
      .startOf('day')
      .hours(22)
      .subtract(moment().startOf('day').valueOf(), 'ms')
      .valueOf();

    const yScale = this.yScale = d3.scale.linear()
      .domain([t7am, t10pm]) // 7am to 10pm
      .range([0, 600]);
    this.y = course => yScale(course.startTime);

    // g that contains items on the calendar
    this.rects = this.gridArea.append('g')
      .attr('class', 'rects')
      .attr('transform', 'translate(15, 0)');

    this.update(this.props);
  }

  componentWillReceiveProps(props) {
    this.update(props);
  }

  update(props) {
    const { x, y, rectWidth } = this;
    const { data } = props;
    let { sections } = props;

    // separate sections into individual meetings
    sections = sections
      .map(c => ({
        data: data.getIn([props.semester, c.dept, c.level, c.section.get('number')]).toJS(),
        color: c.section.get('color')
      }))
      .reduce((p, c, j) => {
        for (let i = 0; i < c.data.meetings.length; i++)
          p.push(Object.assign({}, c.data, {
            meetDay: c.data.meetings[i].day,
            startTime: c.data.meetings[i].time[0],
            endTime: c.data.meetings[i].time[1],
            color: c.color
          }));
        return p;
      }, []);

    // meetings
    const meetings = this.rects.selectAll('.item.meetings')
      .data(sections, s => `${s.dept}${s.level}${s.section}${s.meetDay}`);

    meetings.enter().append('rect')
        .attr('width', rectWidth)
        .attr('class', 'item meetings')
        .attr('height', m => (m.endTime - m.startTime) * 0.000011)
        .attr('x', x)
        .attr('y', 0)
        .attr('fill', c => c.color)
      .transition()
        .duration(600)
        .attr('y', y);

    meetings.exit()
      .transition()
        .duration(600)
        .attr('y', 500)
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .remove();

    // labels
    const labels = this.rects.selectAll('.meetings.labels')
      .data(sections, s => `${s.dept}${s.level}${s.section}${s.meetDay}`);

    labels.enter().append('text')
        .attr('x', m => x(m) + rectWidth / 2)
        .attr('y', 0)
        .attr('class', 'sm meetings labels anchor-middle')
        .text(m => `${m.dept} ${m.level} - ${m.section}`)
      .transition()
        .duration(600)
        .attr('y', m => y(m) + 20);

    labels.exit()
      .transition()
        .duration(600)
        .attr('y', 500)
        .style('fill-opacity', 1e-6)
        .remove();

    // x button
    const deleteButtons = this.rects.selectAll('.meetings.deleteButton')
      .data(sections, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);

    deleteButtons.enter().append('text')
      .attr('x', d => x(d) + rectWidth - 10)
      .attr('y', 0)
      .text('x')
        .attr('class', 'meetings sm deleteButton clickable')
        .on('click', d => this.props.toggleSection(d.department, d.level, d.section))
      .transition()
        .duration(600)
        .attr('y', d => y(d) + 10);

    deleteButtons.exit().remove();
  }

  render() {
    return (<div>
      <div id='calendar'></div>
    </div>);
  }

}

/*
Calendar.propTypes = {
  toggleSection: React.PropTypes.func
};
*/

export default Calendar;
