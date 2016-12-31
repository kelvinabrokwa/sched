/**
 * Utils
 */

// http://www.color-hex.com/color-palette/28445
export const colors = ['#fd7f7f', '#adff8c', '#ffc379', '#71c1fd', '#f7ff78'];

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
