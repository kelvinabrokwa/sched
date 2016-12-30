import CourseListContainer from './containers/course_list_container';
import CalendarContainer from './containers/calendar_container';
import ShareContainer from './containers/share_container';
import CourseSelectContainer from './containers/course_select_container';
import SemesterSelectContainer from './containers/semester_select_container';
import MapContainer from './containers/map_container';

const App = () => (<div className='mb4'>

  <MapContainer />

  <div className='pad2'>
    <div className='pad2'>
      <SemesterSelectContainer />
    </div>

    <div className='flex'>
      <div className='mr2 mt2' style={{ overflowX: 'scroll' }}>
        <CalendarContainer />
      </div>
      <div className='flex1'>
        <CourseSelectContainer />
        <CourseListContainer />
      </div>
    </div>

    <ShareContainer />
  </div>
</div>);

export default App;
