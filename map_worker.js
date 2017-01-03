/**
 * Figure out a class location, geocode it, return lon/lat
 */

onmessage = e => {
  const { data } = e;

  if (self.fetch) {
    fetch(`https://wm-course-data.herokuapp.com/geocode/${data.semester}/${data.crn}`)
      .then(res => res.json())
        .then(d => {
          if (!d.err) {
            postMessage(Object.assign(d, data));
          }
        });
  } else {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      let d = JSON.parse(this.responseText);
      if (!d.err)
        postMessage(Object.assign(d, data));
    });
    xhr.open('GET', `https://wm-course-data.herokuapp.com/geocode/${data.semester}/${data.crn}`);
    xhr.send();
  }
}
