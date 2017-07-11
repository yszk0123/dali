import { startOfDay } from '../../shared/utils/DateUtils';

export default async function generateFakeData({ models }) {
  const { DailySchedule, User } = models;
  const today = startOfDay(new Date());

  const user = await User.create({ name: 'foo' });

  const dailySchedule = await DailySchedule.create({
    date: today,
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
    user.createTaskUnit({ title: 'Breakfast', startAt: today }),
    user.createTaskUnit({ title: 'Lunch', endAt: today }),
    user.createTaskUnit({ title: 'Dinner', startAt: today, endAt: today }),
    user.createTaskUnit({ title: 'Other' }),
    user.addDailySchedule(dailySchedule),
  ]);
}
