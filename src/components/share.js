const Share = ({ queryString }) => (<div className='pad2'>
  <div>
    <div>
      share your sched with the homies:
    </div>
    <div>
      <input
        type='text'
        className=''
        style={{ width: '100%' }}
        value={`http://abrokwa.org/sched/?${queryString}`}
        readOnly={true}
      />
    </div>
  </div>
</div>);

/*
Share.propTypes = {
  queryString: React.PropTypes.string
};
*/

export default Share;
