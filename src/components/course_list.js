const CourseList = ({ courses, data, onSectionToggle, removeCourse }) => (<div>
  <div>your classes</div>
  {courses.map((course, i) => <div key={i}>
    <span
      onClick={removeCourse.bind(this, course.get('dept'), course.get('level'))}
      className='clickable hover-red'
    >
      x
    </span>
    <span className='clickable hover-invert'> {course.get('dept')} {course.get('level')}</span>
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
  </div>)}
</div>);

export default CourseList;
