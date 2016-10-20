const Share = ({ queryString }) => (<div>
  <div>
    share your sched with the homies:
    <input type='text' className='' style={{ width: `${((queryString.length + 20) * 6)}px` }} value={`http://abrokwa.org/sched/?${queryString}`} readOnly={true} />
  </div>
</div>);

/*
Share.propTypes = {
  queryString: React.PropTypes.string
};
*/

export default Share;
