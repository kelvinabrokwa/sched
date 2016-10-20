const SemesterSelect = ({ semester, data, selectSemester }) => (<div>
  <div>
    select semester:
  </div>
  <div>
    <select onChange={selectSemester} value={semester}>
      {data.keySeq().map((s, i) => <option key={i}>{s}</option>)}
    </select>
  </div>
</div>);

/*
SemesterSelect.propTypes = {
  semester: React.PropTypes.string,
  data: React.PropTypes.object,
  selectSemester: React.PropTypes.func
};
*/

export default SemesterSelect;
