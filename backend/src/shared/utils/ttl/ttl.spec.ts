import { calculateDateFromTtl } from './ttl';

describe('calculateDateFromTtl', () => {
  it('returns a date object with the correct time based on the given TTL', () => {
    const ttl = 10000; // 10 seconds
    const currentTime = new Date().getTime();
    const expectedDate = new Date(currentTime + ttl);

    const result = calculateDateFromTtl(ttl);

    expect(result instanceof Date).toBe(true);
    expect(result.getTime()).toBe(expectedDate.getTime());
  });
});
