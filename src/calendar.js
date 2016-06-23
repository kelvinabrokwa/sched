import { toColor, oclock } from './utils';
import moment from 'moment';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: []
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    var { courses } = this.state;

    // setup
    this.rectWidth = 90;
    var calWidth = 700;
    var calHeight = 700;
    var pad = 25;

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
        .attr('class', 'line')

    // day axis
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.svg.append('g').selectAll('text')
      .data(days)
      .enter().append('text')
        .attr('x', (d, i) => i * 125)
        .attr('y', 0)
        .text(d => d)
          .attr('class', 'anchor-middle')
          .attr('transform', 'translate(110, 0)');

    // time axis
    var offset = 4;
    this.svg.append('g').selectAll('text')
      .data(d3.range(7, 23))
      .enter().append('text')
        .attr('x', 0)
        .attr('y', v => (v - 7) * 40 + offset)
        .text(oclock)
        .attr('transform', 'translate(0, 20)');

    // scales
    var xScale = this.xScale = d3.scale.linear()
      .domain([0, 4])
      .range([0, 500]);
    var x = this.x = course => {
      var i = ['M', 'T', 'W', 'R', 'F'].indexOf(course.meetDay);
      return xScale(i);
    };

    var t7am = moment().startOf('day').hours(7).subtract(moment().startOf('day').valueOf(), 'ms').valueOf();
    var t10pm = moment().startOf('day').hours(22).subtract(moment().startOf('day').valueOf(), 'ms').valueOf();

    var yScale = this.yScale = d3.scale.linear()
        .domain([t7am, t10pm]) // 7am to 10pm
          .range([0, 600]);
    var y = this.y = course => yScale(course.startTime);

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
    var { x, y, rectWidth } = this;
    var { data, courses } = props;

    if (!Object.keys(data).length) return; // data hasn't loaded yet

    courses = courses.map(c => data[c[0]][c[1]][c[2]])
      .reduce((p, c) => {
        for (var i = 0; i < c.meetDays.length; i++) {
          p.push(Object.assign({}, c, {meetDay: c.meetDays[i]}));
        }
        return p;
      }, []);

    // meetings
    var meetings = this.rects.selectAll('.item.meetings')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);

    meetings.enter().append('rect')
      .attr('width', rectWidth)
      .attr('class', 'item meetings');

    meetings
      .attr('height', m => m.duration * 0.7)
      .attr('x', x)
      .attr('y', y)
      .attr('fill', c => toColor(`${c.dept}${c.level}${c.section}`));

    meetings.exit().remove();

    // labels
    var labels = this.rects.selectAll('.meetings.labels')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);

    labels.enter().append('text')
      .attr('x', m => x(m) + rectWidth / 2)
      .attr('y', m => y(m) + 20)
      .attr('class', 'sm meetings labels anchor-middle')
      .text(m => `${m.dept} ${m.level} - ${m.section}`);

    labels.exit().remove();

    // x button
    var deleteButtons = this.rects.selectAll('.meetings.deleteButton')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);

    deleteButtons.enter().append('text')
      .attr('x', d => x(d) + rectWidth - 10)
      .attr('y', d => y(d) + 10)
      .text('x')
        .attr('class', 'meetings sm deleteButton clickable')
        .on('click', d => { this.props.removeCourse([d.dept, d.level, d.section]); });

    deleteButtons.exit().remove();
  }

  render() {
    return <div>
      <div id='calendar'></div>
    </div>;
  }

}
