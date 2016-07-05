import CourseListContainer from './containers/course_list_container';
import SelectedCourseContainer from './containers/selected_course_container';
import CalendarContainer from './containers/calendar_container';
import ShareContainer from './containers/share_container';

const App = () => (<div>
  <CourseListContainer />
  <SelectedCourseContainer />
  <CalendarContainer />
  <ShareContainer />
</div>);

export default App;
