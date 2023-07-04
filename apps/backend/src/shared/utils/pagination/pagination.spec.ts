import { calculateSkip } from './pagination';

describe('calculateSkip', () => {
  const calculateAndExpectSkip = (page: number, limit: number, expectedSkip: number) => {
    const skip = calculateSkip(page, limit);
    expect(skip).toEqual(expectedSkip);
  };

  it('should calculate the correct skip value', () => {
    calculateAndExpectSkip(2, 10, 10);
  });

  it('should return 0 when page is 1', () => {
    calculateAndExpectSkip(1, 10, 0);
  });

  it('should return 0 when page is negative', () => {
    calculateAndExpectSkip(-2, 10, 0);
  });

  it('should calculate the correct skip value when limit is 1', () => {
    calculateAndExpectSkip(3, 1, 2);
  });

  it('should calculate the correct skip value when limit is greater than 1', () => {
    calculateAndExpectSkip(3, 5, 10);
  });

  it('should calculate the correct skip value when limit is 0', () => {
    calculateAndExpectSkip(4, 0, 0);
  });
});
