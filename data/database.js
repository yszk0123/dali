import makeIdGenerator from '../src/common/makeIdGenerator';

// User (Viewer)

const VIEWER_ID = 'me';

class User {
  constructor(name) {
    this.name = name;
  }
}

const viewer = new User('World');

const usersById = {
  [VIEWER_ID]: viewer,
};

export function getUserById(id) {
  return usersById[id];
}

export function getViewer() {
  return getUserById(VIEWER_ID);
}

// Project

const generateProjectId = makeIdGenerator();

class Project {
  constructor({ title }) {
    this.id = generateProjectId();
    this.title = title;
  }
}

const projectsById = {};

const projectIdsByUser = {
  [VIEWER_ID]: [],
};

export function addProject({ title }) {
  const project = new Project({ title });

  projectsById[project.id] = project;
  projectIdsByUser[VIEWER_ID].push(project.id);

  return project.id;
}

export function getProjects() {
  return projectIdsByUser[VIEWER_ID].map(id => projectsById[id]);
}

// TimeUnit

const generateTimeUnitId = makeIdGenerator();

class TimeUnit {
  constructor({ title }) {
    this.id = generateTimeUnitId();
    this.title = title;
  }
}

const timeUnitsById = {};

const timeUnitIdsByUser = {
  [VIEWER_ID]: [],
};

export function addTimeUnit({ title }) {
  const timeUnit = new TimeUnit({ title });

  timeUnitsById[timeUnit.id] = timeUnit;
  timeUnitIdsByUser[VIEWER_ID].push(timeUnit.id);

  return timeUnit.id;
}

export function getTimeUnitById(id) {
  return timeUnitsById[id];
}

export function getTimeUnits() {
  return timeUnitIdsByUser[VIEWER_ID].map(id => timeUnitsById[id]);
}

// TaskUnit

const generateTaskUnitId = makeIdGenerator();

class TaskUnit {
  constructor({ title }) {
    this.id = generateTaskUnitId();
    this.title = title;
  }
}

const taskUnitsById = {};

const taskUnitIdsByUser = {
  [VIEWER_ID]: [],
};

export function addTaskUnit({ title }) {
  const taskUnit = new TaskUnit({ title });

  taskUnitsById[taskUnit.id] = taskUnit;
  taskUnitIdsByUser[VIEWER_ID].push(taskUnit.id);

  return taskUnit.id;
}

export function getTaskUnitById(id) {
  return taskUnitsById[id];
}

export function getTaskUnits() {
  return taskUnitIdsByUser[VIEWER_ID].map(id => taskUnitsById[id]);
}

// Fake data

addProject({ title: 'Private' });
addProject({ title: 'Work' });
addTimeUnit({ title: 'Breakfast' });
addTimeUnit({ title: 'Lunch' });
addTimeUnit({ title: 'Dinner' });
