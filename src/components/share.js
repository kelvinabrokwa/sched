/**
 * Share Component
 */
class Share extends React.Component {

  onClick(e) {
    e.target.setSelectionRange(0, e.target.value.length)
  }

  render() {
    return (<div className='pad2'>
      <div>
        <div>
          share your sched with the homies:
        </div>
        <div>
          <input
            type='text'
            className=''
            style={{ width: '100%' }}
            value={`http://abrokwa.org/sched/?${this.props.queryString}`}
            readOnly={true}
            onClick={this.onClick.bind(this)}
          />
        </div>
      </div>
    </div>);
  }

}

/*
Share.propTypes = {
  queryString: React.PropTypes.string
};
*/

export default Share;
