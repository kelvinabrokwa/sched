var fs = require('fs');
var scale = require('d3-scale');

var timeScale = scale.scaleLinear()
  .domain([0, 60])
  .range([0, 100]);

fs.readFile('./raw_data.json', function(err, data) {
  if (err) throw err;
  parse(JSON.parse(data));
});

function parse(data) {
  var c, time, cd;
  data = data.map(function(d) {
    cd = d.courseId.split(' ');
    time = d.meetTimes.split('-');
    d.dept = cd[0];
    d.level = cd[1];
    d.section = cd[2];
    d.startTime = +time[0];
    d.endTime = +time[1];
    var t, min;
    if (d.startTime) {
      t = d.startTime.toString().split('');
      min = timeScale(+t.splice(t.length - 2).join(''));
      min = min.toString().split('');
      if (min.length < 2) min.push(0);
      d.startTimeDec = +t.concat(min).join('');
    }
    if (d.endTime) {
      t = d.endTime.toString().split('');
      min = timeScale(+t.splice(t.length - 2).join(''));
      min = min.toString().split('');
      if (min.length < 2) min.push(0);
      d.endTimeDec = +t.concat(min).join('');
    }
    d.meetDays = d.meetDays.split('').filter(function(m) { return m !== ' '; });
    return d;
  });
  var out = {};
  for (var i = 0; i < data.length; i++) {
    c = data[i];
    if (!(c.dept in out)) {
      out[c.dept] = {};
    }
    if (!(c.level in out[c.dept])) {
      out[c.dept][c.level] = {};
    }
    if (!(c.section in out[c.dept][c.level])) {
      out[c.dept][c.level][c.section] = c;
    }
  }
  fs.writeFileSync('data.json', JSON.stringify(out));
}
