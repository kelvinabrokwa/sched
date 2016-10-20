const SemesterSelect = ({ semester, data, selectSemester }) => (<div>
  Semester: <select onChange={selectSemester}>
    {data.keySeq().map((s, i) => <option key={i}>{s}</option>)}
  </select>
</div>);

/*
SemesterSelect.propTypes = {
  semester: React.PropTypes.string,
  data: React.PropTypes.object,
  selectSemester: React.PropTypes.func
};
*/

export default SemesterSelect;
