import { getDateAttributes } from './date';

describe('getDateAttributes', () => {
  it('should return the correct date attributes in French', () => {
    const timestamp = 1634567890000;
    const expectedAttributes = {
      dayOfWeek: 'lundi',
      twoDigitdayNumber: '18',
      month: 'octobre',
      hour: '16',
      minutes: '38',
      year: '2021',
    };

    const result = getDateAttributes(timestamp);

    expect(result).toEqual(expectedAttributes);
  });
});
