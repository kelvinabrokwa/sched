import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      courses: [['ARAB', '202', '01'], ['MATH', '414', '01']]
    };
    this.addCourse = this.addCourse.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
  }
  componentWillMount() {
    fetch('https://raw.githubusercontent.com/kelvinabrokwa/sched/gh-pages/data/data.json')
      .then(d => d.json())
      .then(data => this.setState({ data }));
  }
  addCourse(dept, level, section) {
    var courses = this.state.courses;
    courses.push([dept, level, section]);
    this.setState({courses});
  }
  removeCourse(course) {
    var { courses } = this.state;
    this.setState({
      courses: courses.filter(c => !(c[1] === course[1] && c[2] === course[2] && c[3] === course[3]))
    });
  }
  render() {
    var { data, courses } = this.state;
    return <div className='container'>
      <h1>sched</h1>
      <div className='left mr4'>
        <Calendar courses={courses} data={data}/>
      </div>
      <div className='left border-left pad2'>
        <SearchArea data={data} addCourse={this.addCourse} selected={this.state.courses} remove={this.removeCourse}/>
      </div>
    </div>;
  }
}

class SearchArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.addCourse = this.addCourse.bind(this);
    this.onSelectDept = this.onSelectDept.bind(this);
    this.onSelectLevel = this.onSelectLevel.bind(this);
    this.onSelectSection = this.onSelectSection.bind(this);
  }
  onSelectDept(dept) {
    this.setState({dept, level: null, section: null});
  }
  onSelectLevel(level) {
    this.setState({level, section: null});
  }
  onSelectSection(section) {
    this.setState({section});
  }
  addCourse() {
    var { dept, level, section } = this.state;
    this.props.addCourse(dept, level, section);
  }
  render() {
    return <div>
      <div className='underline mb2'>Select Courses</div>
      <div className='mb2'>
        <Search options={Object.keys(this.props.data)} onSelect={this.onSelectDept} type='dept'/>
        {this.state.dept && <Search options={Object.keys(this.props.data[this.state.dept])} onSelect={this.onSelectLevel} type='level'/>}
        {this.state.level && <Search options={Object.keys(this.props.data[this.state.dept][this.state.level])} onSelect={this.onSelectSection} type='section'/>}
        {this.state.section && <button onClick={this.addCourse}>add course</button>}
      </div>
      <SelectedList courses={this.props.selected} remove={this.props.remove}/>
    </div>;
  }
}

class Search extends React.Component {
  onSelect(e) {
    this.props.onSelect(e.target.value);
  }
  render() {
    var { options, type } = this.props;
    return <div>
      <div>{type}:</div>
      <select onChange={this.onSelect.bind(this)} className='full-width'>
        <option>---</option>
        {options.map((op, i) => <option key={i}>{op}</option>)}
      </select>
    </div>;
  }
}

class SelectedList extends React.Component {
  render() {
    var { courses } = this.props;
    return <div>
      {courses.map((c, i) =>
        <div key={i} >
          <span className='icon-close' onClick={this.props.remove.bind(this, c)}>x</span>{`${c[0]} ${c[1]} - ${c[2]}`}
        </div>)}
    </div>;
  }
}

class Calendar extends React.Component {
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
    var calHeight = 500;
    var pad = 25;
    this.svg = d3.select('#calendar').append('svg')
        .attr('width', calWidth)
        .attr('height', calHeight)
      .append('g')
        .attr('transform', `translate(${pad},${pad})`);

    // grid
    this.svg.append('g').selectAll('line')
      .data(d3.range(0, 12))
      .enter().append('line')
        .attr('x1', 0)
        .attr('x2', calWidth)
        .attr('y1', h => h * 40)
        .attr('y2', h => h * 40)
        .attr('class', 'line')
        .attr('transform', 'translate(20, 20)');

    // day label
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.svg.append('g').selectAll('text')
      .data(d3.range(0, 5))
      .enter().append('text')
        .attr('x', d => d * 125)
        .attr('y', 0)
        .text(d => days[d])
        .attr('class', 'anchor-middle')
        .attr('transform', 'translate(100, 0)');

    // time
    var offset = 4;
    this.svg.append('g').selectAll('text')
      .data(d3.range(0, 12))
      .enter().append('text')
        .attr('x', 0)
        .attr('y', v => v * 40 + offset)
        .text(d3.scale.linear().domain([0, 12]).range([8, 20]))
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
    var yScale = d3.scale.linear()
        .domain([800, 1700])
        .range([0, 200]);
    var y = course => yScale(course.startTime);
    this.svg.append('g').selectAll('rect')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`)
      .enter().append('rect')
        .attr('width', 75)
        .attr('height', m => (m.endTime - m.startTime) * 0.7)
        .attr('x', x)
        .attr('y', y)
        .attr('class', 'item meetings')
        .attr('transform', 'translate(50, 0)');

    // labels
    this.svg.append('g').selectAll('text')
      .data(courses)
      .enter().append('text')
        .attr('x', x)
        .attr('y', m => y(m) + 20)
        .text(m => `${m.dept} ${m.level} - ${m.section}`)
        .attr('class', 'sm meetings labels')
        .attr('transform', 'translate(50, 0)');
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
    var yScale = d3.scale.linear()
        .domain([800, 1700])
        .range([0, 200]);
    var y = course => yScale(course.startTime);

    // meetings
    var meetings = this.svg.selectAll('.item.meetings')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);
    meetings.enter().append('rect')
        .attr('width', 75)
        .attr('class', 'item meetings')
        .attr('transform', 'translate(50, 0)');
    meetings
        .attr('height', m => (m.endTime - m.startTime) * 0.7)
        .attr('x', x)
        .attr('y', y);
    meetings.exit().remove();

    // labels
    var labels = this.svg.selectAll('.meetings.labels')
      .data(courses, c => `${c.dept}${c.level}${c.section}${c.meetDay}`);
    labels.enter().append('text')
        .attr('x', x)
        .attr('y', m => y(m) + 20)
        .attr('class', 'sm meetings labels')
        .attr('transform', 'translate(50, 0)')
        .text(m => `${m.dept} ${m.level} - ${m.section}`);
    labels.exit().remove();
  }
  render() {
    return <div>
      <div id='calendar'></div>
    </div>;
  }
}

