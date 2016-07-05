const CourseList = ({ courses, onCourseClick }) => (<div>
  {courses.map((course, i) => <div key={i}
    onClick={onCourseClick.bind(this, course.get('dept'), course.get('level'))}
  >
    {course.get('dept')} {course.get('level')}
  </div>)}
</div>);

export default CourseList;
