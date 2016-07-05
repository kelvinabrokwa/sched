import CourseListContainer from './containers/course_list_container';
import SelectedCourseContainer from './containers/selected_course_container';
import CalendarContainer from './containers/calendar_container';
import ShareContainer from './containers/share_container';
import CourseSelectContainer from './containers/course_select_container';

const App = () => (<div>
  <CourseSelectContainer />
  <hr />
  <CourseListContainer />
  <hr />
  <SelectedCourseContainer />
  <hr />
  <CalendarContainer />
  <ShareContainer />
</div>);

export default App;
