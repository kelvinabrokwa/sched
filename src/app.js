import CourseListContainer from './containers/course_list_container';
import CalendarContainer from './containers/calendar_container';
import ShareContainer from './containers/share_container';
import CourseSelectContainer from './containers/course_select_container';
import SemesterSelectContainer from './containers/semester_select_container';

const App = () => (<div>
  <div className='bg-black center'>
    <div className='med funky'>sched</div>
  </div>
  <div className='pad2 body-margin-left'>
    <div className='mb4'>
      <SemesterSelectContainer />
    </div>
    <div className='flex'>
      <div className='mr2'>
        <CourseSelectContainer />
        <CourseListContainer />
      </div>
      <div className='mt3'>
        <CalendarContainer />
      </div>
    </div>
    <ShareContainer />
  </div>
</div>);

export default App;
