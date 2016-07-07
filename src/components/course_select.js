class CourseSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dept: null,
      level: null
    };
    this.onDeptSelect = this.onDeptSelect.bind(this);
    this.onLevelSelect = this.onLevelSelect.bind(this);
    this.addCourse = this.addCourse.bind(this);
  }
  onDeptSelect(e) {
    const { data } = this.props;
    const dept = e.target.value;
    if (!dept) return;
    this.setState({ dept, level: data.get(dept).keySeq().sort().get(0) });
  }
  onLevelSelect(e) {
    this.setState({ level: e.target.value });
  }
  addCourse() {
    this.props.addCourse(this.state.dept, this.state.level);
  }
  render() {
    const { data } = this.props;
    const depts = data.keySeq().sort();
    const { dept, level } = this.state;
    let levels;
    if (dept) {
      levels = data.get(dept).entrySeq().map(d => Immutable.Map({
        level: d[0],
        courseName: d[1].first().get('title')
      })).sortBy(l => l.get('level'));
    }
    return (<div className='mb2'>
      <div>add course:</div>
      <div>
        <select onChange={this.onDeptSelect.bind(this)}>
          <option></option>
          {depts.map(dept_ => <option key={dept_}>{dept_}</option>)}
        </select>
      </div>
      {levels && <div>
        <select onChange={this.onLevelSelect}>
          {levels.map(level_ => <option
            key={level_.get('level')}
            value={level_.get('level')}
          >
            {level_.get('level')} - {level_.get('courseName')}
          </option>)}
        </select>
      </div>}
      {(dept && level) && <div>
        <button onClick={this.addCourse}>add course</button>
      </div>}
    </div>);
  }
}

CourseSelect.propTypes = {
  data: React.PropTypes.object,
  addCourse: React.PropTypes.func
};

export default CourseSelect;
