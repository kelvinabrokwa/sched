import CourseListContainer from './containers/course_list_container';
import CalendarContainer from './containers/calendar_container';
import ShareContainer from './containers/share_container';
import CourseSelectContainer from './containers/course_select_container';

const App = () => (<div>
  <h1 className='funk'>sched</h1>
  <div className='flex'>
    <div>
      <CourseSelectContainer />
      <CourseListContainer />
    </div>
    <div>
      <CalendarContainer />
    </div>
  </div>
  <ShareContainer />
</div>);

export default App;
