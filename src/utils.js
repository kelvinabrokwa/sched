// credit to Mapbox
// via: https://github.com/mapbox/to-color
export function toColor(str, opacity) {
  const rgb = [0, 0, 0, opacity || 0.75];
  try {
    for (let i = 0; i < str.length; i++) {
      const v = str.charCodeAt(i);
      const idx = v % 3;
      rgb[idx] = (rgb[i % 3] + (13 * (v % 13))) % 20;
    }
  } finally {
    return `rgba(${rgb.map((c, idx) => idx === 3 ? c : (4 + c) * 17).join(',')})`;
  }
}

export function oclock(time) {
  if (time === 0) {
    return '12am';
  } else if (time < 12) {
    return `${time}am`;
  } else if (time === 12) {
    return `${time}pm`;
  }
  return `${(time % 12)}pm`;
}
