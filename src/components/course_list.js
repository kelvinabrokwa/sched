const CourseList = ({ courses, onCourseClick, removeCourse }) => (<div>
  <div>your classes</div>
  {courses.map((course, i) => <div key={i}>
    <span onClick={removeCourse.bind(this, course.get('dept'), course.get('level'))} className='clickable hover-red'>x </span>
    <span onClick={onCourseClick.bind(this, course.get('dept'), course.get('level'))} className='clickable hover-invert hover-edit-icon'>
      {course.get('dept')} {course.get('level')}
    </span>
  </div>)}
</div>);

export default CourseList;
