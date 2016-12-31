import { toColor } from '../utils';

const CourseList = ({ semester, courses, data, onSectionToggle, removeCourse }) => (<div className='masonry-container'>
  <ul className='masonry-ul'>
    {courses.map((course, i) => <li key={i}>
      <div
        className='border-blue mb1 top-right-container full-width'
        style={{display: 'inline-block' }}
      >
        <div
          onClick={removeCourse.bind(this, course.get('dept'), course.get('level'))}
          className='clickable hover-red top-right'
        >
          x
        </div>
        <div className='pad2'>
          <div className='bold'>
            {course.get('dept')} {course.get('level')}: {data.getIn([
              semester,
              course.get('dept'),
              course.get('level')
            ]).first().get('title')}
          </div>
          <div>
            {data.getIn([
              semester,
              course.get('dept'),
              course.get('level')
            ]).toIndexedSeq().map((section, id) => <div
              key={id}
              className={`hover-bg-blue pad1 clickable border-blue ${course.get('sections').includes(section.get('section')) && 'bg-blue'}`}
              onClick={onSectionToggle.bind(
                this,
                section.get('department'),
                section.get('level'),
                section.get('section')
              )}
            >
              {section.get('section')}: <a target='_blank' href={`http://www.ratemyprofessors.com/search.jsp?query=` +
                `${section.get('INSTRUCTOR')}`}>{section.get('INSTRUCTOR')}</a>
              {formatMeetings(section.get('meetings'))}
            </div>)}
          </div>
        </div>
      </div>
    </li>)}
  </ul>
</div>);

function formatMeetings(meetings) {
  let startTime, endTime, time, day, mins;
  const m = {};
  for (let i = 0; i < meetings.size; i++) {
    day = meetings.getIn([i, 'day']);
    mins = moment(meetings.getIn([i, 'time', 0])).minutes();
    startTime = `${moment(meetings.getIn([i, 'time', 0])).utc().hours()}:${mins === 0 ? '00' : mins}`;
    mins = moment(meetings.getIn([i, 'time', 1])).minutes();
    endTime = `${moment(meetings.getIn([i, 'time', 1])).utc().hours()}:${mins === 0 ? '00' : mins}`;
    time = `${startTime} - ${endTime}`;
    if (time in m)
      m[time].push(day);
    else
      m[time] = [day];
  }

  return (<div>
    <ul className='mt0 list'>
      {Object.keys(m).map((t, i) => <li key={i}>{m[t].join(',')} | {t}</li>)}
    </ul>
  </div>);
}

export default CourseList;
