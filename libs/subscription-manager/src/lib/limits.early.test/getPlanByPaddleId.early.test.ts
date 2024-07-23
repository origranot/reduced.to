// Unit tests for: getPlanByPaddleId

import { getPlanByPaddleId, PLAN_LEVELS } from '../limits';

describe('getPlanByPaddleId() getPlanByPaddleId method', () => {
  // Happy Path Tests
  it('should return the BASE plan when given the correct Paddle ID for the Free plan', () => {
    // This test checks if the function returns the correct plan for the Free plan.
    const result = getPlanByPaddleId(PLAN_LEVELS.FREE.PADDLE_PLAN_ID);
    expect(result).toEqual(PLAN_LEVELS.FREE);
  });

  it('should return the PRO plan when given the correct Paddle ID for the Pro plan', () => {
    // This test checks if the function returns the correct plan for the Pro plan.
    const result = getPlanByPaddleId(PLAN_LEVELS.PRO.PADDLE_PLAN_ID);
    expect(result).toEqual(PLAN_LEVELS.PRO);
  });

  it('should return the BUSINESS plan when given the correct Paddle ID for the Business plan', () => {
    // This test checks if the function returns the correct plan for the Business plan.
    const result = getPlanByPaddleId(PLAN_LEVELS.BUSINESS.PADDLE_PLAN_ID);
    expect(result).toEqual(PLAN_LEVELS.BUSINESS);
  });

  // Edge Case Tests
  it('should return undefined when given an invalid Paddle ID', () => {
    // This test checks if the function returns undefined for an invalid Paddle ID.
    const result = getPlanByPaddleId('invalid_id');
    expect(result).toBeUndefined();
  });

  it('should return undefined when given an empty string as Paddle ID', () => {
    // This test checks if the function returns undefined for an empty string.
    const result = getPlanByPaddleId('');
    expect(result).toBeUndefined();
  });

  it('should return undefined when given a null value as Paddle ID', () => {
    // This test checks if the function returns undefined for a null value.
    const result = getPlanByPaddleId(null as any); // Type assertion to allow null
    expect(result).toBeUndefined();
  });

  it('should return undefined when given an undefined value as Paddle ID', () => {
    // This test checks if the function returns undefined for an undefined value.
    const result = getPlanByPaddleId(undefined as any); // Type assertion to allow undefined
    expect(result).toBeUndefined();
  });

  it('should return undefined when given a numeric value as Paddle ID', () => {
    // This test checks if the function returns undefined for a numeric value.
    const result = getPlanByPaddleId(12345 as any); // Type assertion to allow number
    expect(result).toBeUndefined();
  });
});

// End of unit tests for: getPlanByPaddleId
