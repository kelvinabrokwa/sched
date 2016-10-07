class CourseSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dept: null,
      level: null
    };

    this.onSemesterSelect = this.onSemesterSelect.bind(this);
    this.onDeptSelect = this.onDeptSelect.bind(this);
    this.onLevelSelect = this.onLevelSelect.bind(this);
    this.addCourse = this.addCourse.bind(this);
  }

  onSemesterSelect(e) {
    this.setState({ semester: e.target.value });
  }

  onDeptSelect(e) {
    const dept = e.target.value;
    if (!dept)
      return;
    this.setState({ dept });
  }

  onLevelSelect(e) {
    this.setState({ level: e.target.value });
  }

  addCourse() {
    this.props.addCourse(this.state.dept, this.state.level);
  }

  render() {
    const { data, semester } = this.props;
    const { dept, level } = this.state;

    // departments
    const depts = data.get(semester).keySeq().sort();

    // levels
    let levels;
    if (dept) {
      levels = data.get(semester).get(dept).entrySeq().map(d => Immutable.Map({
        level: d[0],
        courseName: d[1].first().get('TITLE')
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
  addCourse: React.PropTypes.func,
  semester: React.PropTypes.string
};

export default CourseSelect;
