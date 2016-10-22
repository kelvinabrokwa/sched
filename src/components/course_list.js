import { toColor } from '../utils';

const CourseList = ({ semester, courses, data, onSectionToggle, removeCourse }) => (<div>
  {courses.map((course, i) => <div key={i} className='border-black border-rounded top-right-container mb2 drop-shadow' style={{ 'background-color': toColor(course.get('dept')) }}>
    <div
      onClick={removeCourse.bind(this, course.get('dept'), course.get('level'))}
      className='clickable hover-red top-right'
    >
      x
    </div>
    <div className='pad2'>
      <div>
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
        ]).toIndexedSeq().map((section, id) => <div key={id}>
          <input
            type='radio'
            checked={course.get('sections').includes(section.get('section'))}
            onChange={onSectionToggle.bind(
              this,
              section.get('department'),
              section.get('level'),
              section.get('section')
            )}
          />
          {section.get('section')}: {section.get('MEET DAYS').join(',')} | {section.get('MEET TIMES')} | <a target='_blank' href={`http://www.ratemyprofessors.com/search.jsp?query=${section.get('INSTRUCTOR')}`}>{section.get('INSTRUCTOR')}</a>
        </div>)}
      </div>
    </div>
  </div>)}
</div>);

export default CourseList;
