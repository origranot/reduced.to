// Unit tests for: sleep

import { sleep } from '../promise';
// sleep.test.ts

// sleep.test.ts
describe('sleep() sleep method', () => {
  // Happy Path Tests
  it('should resolve after the specified time (100ms)', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  it('should resolve after the specified time (500ms)', async () => {
    const start = Date.now();
    await sleep(500);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(500);
  });

  it('should resolve immediately when time is 0ms', async () => {
    const start = Date.now();
    await sleep(0);
    const end = Date.now();
    expect(end - start).toBeLessThan(10); // Should resolve almost immediately
  });

  // Edge Case Tests
  it('should handle negative time values gracefully', async () => {
    const start = Date.now();
    await sleep(-100);
    const end = Date.now();
    expect(end - start).toBeLessThan(10); // Should resolve almost immediately
  });

  it('should handle very large time values', async () => {
    const start = Date.now();
    await sleep(100000); // 100 seconds
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100000);
  });

  it('should handle non-numeric input by treating it as 0', async () => {
    const start = Date.now();
    await sleep(NaN);
    const end = Date.now();
    expect(end - start).toBeLessThan(10); // Should resolve almost immediately
  });

  it('should handle non-numeric input (string) by treating it as 0', async () => {
    const start = Date.now();
    await sleep('100' as any); // Type assertion to bypass TypeScript check
    const end = Date.now();
    expect(end - start).toBeLessThan(10); // Should resolve almost immediately
  });

  it('should handle undefined input by treating it as 0', async () => {
    const start = Date.now();
    await sleep(undefined as any); // Type assertion to bypass TypeScript check
    const end = Date.now();
    expect(end - start).toBeLessThan(10); // Should resolve almost immediately
  });
});

// End of unit tests for: sleep
