/**
 * Fetch course data
 */
if (self.fetch) {
  fetch('https://wm-course-data.herokuapp.com/courses')
    .then(res => res.json())
    .then(data => {
      postMessage(data);
      close();
    });
} else {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function() {
    postMessage(JSON.parse(this.responseText));
    close()
  });
  xhr.open('GET', 'https://wm-course-data.herokuapp.com/courses');
  xhr.send();
}
