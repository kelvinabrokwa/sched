/**
 * Fetch course data
 */
fetch('https://wm-course-data.herokuapp.com/courses')
  .then(res => res.json())
  .then(data => {
    postMessage(data);
  });
