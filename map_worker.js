/**
 * Figure out a class location, geocode it, return lon/lat
 */

onmessage = e => {
  const { data } = e;

  fetch(`https://wm-course-data.herokuapp.com/geocode/${201720}/${data.crn}`)
    .then(res => res.json())
    .then(d => {
      if (!d.err) {
        postMessage(Object.assign(d, data));
      }
    });
}
