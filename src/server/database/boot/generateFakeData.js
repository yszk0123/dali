import { startOfDay } from '../../shared/utils/DateUtils';

export default async function generateFakeData({ models: { User } }) {
  const scheduleDate = startOfDay(new Date());

  const user = await User.create({ name: 'foo' });

  await Promise.all([
    user.createTimeUnit({ scheduleDate, position: 0 }),
    user.createTimeUnit({ scheduleDate, position: 1 }),
    user.createTimeUnit({ scheduleDate, position: 2 }),
    user.createProject({ title: 'Private' }),
    user.createProject({ title: 'Work' }),
    user.createTaskUnit({ title: 'Breakfast' }),
    user.createTaskUnit({ title: 'Lunch' }),
    user.createTaskUnit({ title: 'Dinner' }),
    // TODO
    // user.createDailyReport({}),
  ]);
}
