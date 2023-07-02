import { calculateDateFromTtl } from './ttl';

describe('calculateDateFromTtl', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2021-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns a date object with the correct time based on the given TTL', () => {
    const ttl = 10000; // 10 seconds
    const currentTime = new Date().getTime();
    const expectedDate = new Date(currentTime + ttl);

    const result = calculateDateFromTtl(ttl);

    expect(result instanceof Date).toBe(true);
    expect(result.getTime()).toBe(expectedDate.getTime());
  });
});
