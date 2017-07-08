import { startOfDay } from '../../shared/utils/DateUtils';

export default async function generateFakeData({ models }) {
  const {
    DailyReport,
    DailySchedule,
    Project,
    TaskUnit,
    TimeUnit,
    User,
  } = models;

  const user = await User.create({ name: 'foo' });
  const projects = await Promise.all([
    Project.create({ title: 'Private' }),
    Project.create({ title: 'Work' }),
  ]);
  const taskUnits = await Promise.all([
    TaskUnit.create({ title: 'Breakfast' }),
    TaskUnit.create({ title: 'Lunch' }),
    TaskUnit.create({ title: 'Dinner' }),
  ]);
  const timeUnits = await Promise.all([
    TimeUnit.build({ position: 0 }),
    TimeUnit.build({ position: 1 }),
    TimeUnit.build({ position: 2 }),
  ]);
  const dailySchedule = await DailySchedule.create({
    date: startOfDay(new Date()),
  });
  const dailyReport = await DailyReport.create({});
  await Promise.all([
    dailySchedule.addTimeUnits(timeUnits),
    dailySchedule.setDailyReport(dailyReport),
  ]);
  await Promise.all([
    user.addProjects(projects),
    user.addTaskUnits(taskUnits),
    user.addDailySchedule(dailySchedule),
  ]);
}
