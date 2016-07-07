const CourseList = ({ courses, data, onSectionToggle, removeCourse }) => (<div>
  {courses.map((course, i) => <div key={i} className='border-black top-right-container'>
    <div
      onClick={removeCourse.bind(this, course.get('dept'), course.get('level'))}
      className='clickable hover-red top-right'
    >
      x
    </div>
    <div className='pad2'>
      <div> {course.get('dept')} {course.get('level')}: {data.getIn([course.get('dept'), course.get('level')]).first().get('title')}</div>
      <div>
        {data.getIn([
          course.get('dept'),
          course.get('level')
        ]).toIndexedSeq().map((section, id) => <div key={id}>
          <input
            type='radio'
            checked={course.get('sections').includes(section.get('section'))}
            onChange={onSectionToggle.bind(
              this,
              section.get('dept'),
              section.get('level'),
              section.get('section')
            )}
          />
          {section.get('section')}: {section.get('meetDays').join(',')} | {section.get('meetTimes')} | <a target='_blank' href={`http://www.ratemyprofessors.com/search.jsp?query=${section.get('instructor')}`}>{section.get('instructor')}</a>
        </div>)}
      </div>
    </div>
  </div>)}
</div>);

export default CourseList;
