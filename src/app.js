import Calendar from './calendar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      courses: []
    };
    this.addCourse = this.addCourse.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
  }
  componentWillMount() {
    //fetch('/data/data.json')
    fetch('https://raw.githubusercontent.com/kelvinabrokwa/sched/gh-pages/data/data.json')
      .then(d => d.json())
      .then(data => this.setState({ data }));
    var query = window.location.href.split('q=');
    if (query.length < 2) return;
    try {
      this.setState({ courses: JSON.parse(decodeURIComponent(query[1])) });
    }
    catch (e) {
      console.log('incorrectly formatted url');
    }
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
    return <div className='container mb10'>
      <h1 className='funk underline'>sched</h1>
      <div className='flex'>
        <div className='flex-1' style={{height: '500px'}}>
          <SearchArea data={data} addCourse={this.addCourse} selected={this.state.courses} remove={this.removeCourse}/>
        </div>
        <div className='flex-4'>
          <Calendar courses={courses} data={data} removeCourse={this.removeCourse}/>
        </div>
      </div>
      <Share courses={this.state.courses}/>
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
      <form>
      <label>{type}:</label>
      <select onChange={this.onSelect.bind(this)} className='full-width'>
        <option>---</option>
        {options.map((op, i) => <option key={i}>{op}</option>)}
      </select>
      </form>
    </div>;
  }
}

class SelectedList extends React.Component {
  render() {
    var { courses } = this.props;
    return <div className='keyline-top'>
      {courses.map((c, i) =>
        <div key={i} >
          <span className='icon-close' onClick={this.props.remove.bind(this, c)}>x</span>{`${c[0]} ${c[1]} - ${c[2]}`}
        </div>)}
    </div>;
  }
}

class Share extends React.Component {
  render() {
    return <div>
      share your sched with the homies!
      <input type='text' className='full-width' value={`http://abrokwa.org/sched/?q=${JSON.stringify(this.props.courses)}`} readOnly={true}/>
    </div>;
  }
}
