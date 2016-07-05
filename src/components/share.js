const Share = ({ queryString }) => (<div>
  share your sched with the homies!
  <input type='text' className='full-width' value={`http://abrokwa.org/sched/?${queryString}`} readOnly={true} />
</div>);

Share.propTypes = {
  courses: React.PropTypes.array
};

export default Share;
