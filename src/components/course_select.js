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
    this.setState({ dept: e.target.value, level: null });
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
      levels = data.get(dept).keySeq().sort();
    }
    return (<div>
      <div>
        <select onChange={this.onDeptSelect.bind(this)}>
          {depts.map(dept_ => <option key={dept_}>{dept_}</option>)}
        </select>
      </div>
      {levels && <div>
        <select onChange={this.onLevelSelect}>
          {levels.map(level => <option key={level}>{level}</option>)}
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
