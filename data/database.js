function makeIdGenerator(initialId = 0) {
  let nextId = initialId;

  return function generateId() {
    return `${nextId++}`;
  };
}

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

// Round

const generateRoundId = makeIdGenerator();

class Round {
  constructor({ title }) {
    this.id = generateRoundId();
    this.title = title;
  }
}

const roundsById = {};

const roundIdsByUser = {
  [VIEWER_ID]: [],
};

export function addRound({ title }) {
  const round = new Round({ title });

  roundsById[round.id] = round;
  roundIdsByUser[VIEWER_ID].push(round.id);

  return round.id;
}

export function getRoundById(id) {
  return roundsById[id];
}

export function getRounds() {
  return roundIdsByUser[VIEWER_ID].map(id => roundsById[id]);
}

// Fake data

addProject({ title: 'Private' });
addProject({ title: 'Work' });
addRound({ title: 'Breakfast' });
addRound({ title: 'Lunch' });
addRound({ title: 'Dinner' });
