import CourseListContainer from './containers/course_list_container';
import SelectedCourseContainer from './containers/selected_course_container';
import CalendarContainer from './containers/calendar_container';

const App = () => (<div>
  <CourseListContainer />
  <SelectedCourseContainer />
  <CalendarContainer />
</div>);

export default App;

/*
const Share = props => (<div>
  share your sched with the homies!
  <input type='text' className='full-width' value={`http://abrokwa.org/sched/?q=${JSON.stringify(props.courses)}`} readOnly={true}/>
</div>);
*/
