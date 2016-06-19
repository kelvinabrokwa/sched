var fs = require('fs');
var moment = require('moment');

fs.readFile('./raw_data.json', function(err, data) {
  if (err) throw err;
  parse(JSON.parse(data));
});

function parse(data) {
  var c, time, cd;
  data = data.map(function(d) {
    cd = d.courseId.split(' ');
    d.dept = cd[0];
    d.level = cd[1];
    d.section = cd[2];
    d.meetDays = d.meetDays.split('').filter(function(m) { return m !== ' '; });

    if (d.meetTimes) {
      time = d.meetTimes.split('-');
      var start = time[0];
      var end = time[1];
      if (!start || !end) return d;
      var startTime = moment().startOf('day').hours(+start.substring(0, 2)).minutes(+start.substring(2, 4)).subtract(moment().startOf('day').valueOf(), 'ms');
      var endTime = moment().startOf('day').hours(+end.substring(0, 2)).minutes(+end.substring(2, 4)).subtract(moment().startOf('day').valueOf(), 'ms');
      var duration = moment.duration(endTime.diff(startTime));
      d.duration = duration.asMinutes();
      d.startTime = startTime.valueOf();
      d.endTime = endTime.valueOf();
    }

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
