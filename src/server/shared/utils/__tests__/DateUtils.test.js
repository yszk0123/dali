import { startOfDay } from '../DateUtils';

describe('startOfDay', () => {
  it('returns start of day', () => {
    const dataSet = [
      {
        input: new Date('2000-01-01T00:00:00+00:00'),
        expected: new Date('2000-01-01T00:00:00+00:00'),
      },
      {
        input: new Date('2000-01-01T23:59:59+00:00'),
        expected: new Date('2000-01-01T00:00:00+00:00'),
      },
      {
        input: new Date('2000-01-01T09:00:00+09:00'),
        expected: new Date('2000-01-01T00:00:00+00:00'),
      },
    ];

    dataSet.forEach(({ input, expected }) => {
      expect(startOfDay(input)).toEqual(expected);
    });
  });
});
