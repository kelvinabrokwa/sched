import React from 'react';
import { toColor, oclock } from './utils';
import moment from 'moment';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: []
    };
  }

  componentDidMount() {
    var { courses } = this.state;

    // setup
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

    // day label
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.svg.append('g').selectAll('text')
      .data(d3.range(0, 5))
      .enter().append('text')
        .attr('x', d => d * 125)
        .attr('y', 0)
        .text(d => days[d])
        .attr('class', 'anchor-middle')
        .attr('transform', 'translate(115, 0)');

    // time label
    var offset = 4;
    this.svg.append('g').selectAll('text')
      .data(d3.range(7, 23))
      .enter().append('text')
        .attr('x', 0)
        .attr('y', v => (v - 7) * 40 + offset)
        .text(oclock)
        .attr('transform', 'translate(0, 20)');

    // meetings
    var padx = 30;
    var xScale = d3.scale.linear()
      .domain([0, 4])
      .range([0, 400]);
    var x = course => {
      var i = ['M', 'T', 'W', 'R', 'F'].indexOf(course.meetDay);
      return xScale(i) + i * padx;
    };

    var yScale = d3.scale.linear();
    var y = course => yScale(course.startTimeDec);

    // g that contains items on the calendar
    this.rects = this.gridArea.append('g')
      .attr('class', 'rects')
      .attr('transform', 'translate(15, 0)');

    // rects
    this.rects.append('g').selectAll('rect')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`)
      .enter().append('rect')
        .attr('width', 75)
        .attr('height', m => m.duration * 0.7)
        .attr('x', x)
        .attr('y', y)
        .attr('class', 'item meetings');

    // labels
    this.rects.append('g').selectAll('text')
      .data(courses)
      .enter().append('text')
        .attr('x', x)
        .attr('y', m => y(m) + 20)
        .text(m => `${m.dept} ${m.level} - ${m.section}`)
        .attr('class', 'sm meetings labels');
  }

  componentWillReceiveProps(props) {
    var { data, courses } = props;
    courses = courses.map(c => data[c[0]][c[1]][c[2]])
      .reduce((p, c) => {
        for (var i = 0; i < c.meetDays.length; i++) {
          p.push(Object.assign({}, c, {meetDay: c.meetDays[i]}));
        }
        return p;
      }, []);

    var padx = 30;
    var xScale = d3.scale.linear()
      .domain([0, 4])
      .range([0, 400]);
    var x = course => {
      var i = ['M', 'T', 'W', 'R', 'F'].indexOf(course.meetDay);
      return xScale(i) + i * padx;
    };
    var t7am = moment().startOf('day').hours(7).subtract(moment().startOf('day').valueOf(), 'ms').valueOf();
    var t10pm = moment().startOf('day').hours(22).subtract(moment().startOf('day').valueOf(), 'ms').valueOf();
    var yScale = d3.scale.linear()
        .domain([t7am, t10pm]) // 7am to 10pm
          .range([0, 600]);
    var y = course => yScale(course.startTime);
    // meetings
    var meetings = this.rects.selectAll('.item.meetings')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);
    meetings.enter().append('rect')
      .attr('width', 75)
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
      .attr('x', m => x(m) + 37)
      .attr('y', m => y(m) + 20)
      .attr('class', 'sm meetings labels anchor-middle')
      .text(m => `${m.dept} ${m.level} - ${m.section}`);
    labels.exit().remove();
  }

  render() {
    return <div>
      <div id='calendar'></div>
    </div>;
  }

}
