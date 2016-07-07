const Share = ({ queryString }) => (<div>
  <div>
    share your sched with the homies!
  </div>
  <div>
    <input type='text' className='full-width' value={`http://abrokwa.org/sched/?${queryString}`} readOnly={true} />
  </div>
</div>);

Share.propTypes = {
  queryString: React.PropTypes.string
};

export default Share;
