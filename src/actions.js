export const ADD_COURSE = 'ADD_COURSE';
export const REMOVE_COURSE = 'REMOVE_COURSE';
export const ADD_SECTION = 'ADD_SECTION';
export const REMOVE_SECTION = 'REMOVE_SECTION';
export const TOGGLE_SECTION = 'TOGGLE_SECTION';
export const SELECT_COURSE = 'SELECT_COURSE';

export function addCourse(dept, level) {
  return { type: ADD_COURSE, dept, level };
}

export function removeCourse(dept, level) {
  return { type: REMOVE_COURSE, dept, level };
}

export function addSection(dept, level, section) {
  return { type: ADD_SECTION, dept, level, section };
}

export function removeSection(dept, level, section) {
  return { type: REMOVE_SECTION, dept, level, section };
}

export function toggleSection(dept, level, section) {
  return { type: TOGGLE_SECTION, dept, level, section };
}

export function selectCourse(dept, level) {
  return { type: SELECT_COURSE, dept, level };
}
