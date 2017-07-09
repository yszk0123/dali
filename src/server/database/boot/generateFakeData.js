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

  const dailySchedule = await DailySchedule.create({
    date: startOfDay(new Date()),
  });
  await Promise.all([
    dailySchedule.createTimeUnit({ position: 0 }),
    dailySchedule.createTimeUnit({ position: 1 }),
    dailySchedule.createTimeUnit({ position: 2 }),
    dailySchedule.createDailyReport({}),
  ]);

  await Promise.all([
    user.createProject({ title: 'Private' }),
    user.createProject({ title: 'Work' }),
    user.createTaskUnit({ title: 'Breakfast' }),
    user.createTaskUnit({ title: 'Lunch' }),
    user.createTaskUnit({ title: 'Dinner' }),
    user.addDailySchedule(dailySchedule),
  ]);
}
