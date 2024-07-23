// Unit tests for: addUtmParams

import { addUtmParams } from '../utm';

describe('addUtmParams() addUtmParams method', () => {
  // Happy Path Tests
  it('should return the original URL when no UTM parameters are provided', () => {
    // This test checks that the function returns the original URL when no UTM parameters are given.
    const url = 'https://example.com';
    const utm = {};
    expect(addUtmParams(url, utm)).toBe(url);
  });

  it('should append UTM parameters to the URL correctly', () => {
    // This test verifies that UTM parameters are appended correctly to the URL.
    const url = 'https://example.com';
    const utm = { utm_source: 'newsletter', utm_medium: 'email' };
    const expectedUrl = 'https://example.com/?utm_source=newsletter&utm_medium=email';
    expect(addUtmParams(url, utm)).toBe(expectedUrl);
  });

  it('should append multiple UTM parameters to the URL', () => {
    // This test checks that multiple UTM parameters are appended correctly.
    const url = 'https://example.com';
    const utm = { utm_source: 'google', utm_campaign: 'spring_sale', utm_term: 'shoes' };
    const expectedUrl = 'https://example.com/?utm_source=google&utm_campaign=spring_sale&utm_term=shoes';
    expect(addUtmParams(url, utm)).toBe(expectedUrl);
  });

  it('should handle existing query parameters in the URL', () => {
    // This test ensures that UTM parameters are added to a URL that already has query parameters.
    const url = 'https://example.com?existing_param=value';
    const utm = { utm_source: 'social', utm_medium: 'post' };
    const expectedUrl = 'https://example.com?existing_param=value&utm_source=social&utm_medium=post';
    expect(addUtmParams(url, utm)).toBe(expectedUrl);
  });

  // Edge Case Tests
  it('should return the original URL when UTM is null', () => {
    // This test checks that the function returns the original URL when UTM is null.
    const url = 'https://example.com';
    const utm = null;
    expect(addUtmParams(url, utm)).toBe(url);
  });

  it('should return the original URL when UTM is an empty object', () => {
    // This test verifies that the function returns the original URL when UTM is an empty object.
    const url = 'https://example.com';
    const utm = {};
    expect(addUtmParams(url, utm)).toBe(url);
  });

  it('should handle UTM parameters with empty values', () => {
    // This test checks that UTM parameters with empty values are appended correctly.
    const url = 'https://example.com';
    const utm = { utm_source: '', utm_medium: 'email' };
    const expectedUrl = 'https://example.com/?utm_source=&utm_medium=email';
    expect(addUtmParams(url, utm)).toBe(expectedUrl);
  });

  it('should handle special characters in UTM parameter values', () => {
    // This test ensures that UTM parameters with special characters are encoded correctly.
    const url = 'https://example.com';
    const utm = { utm_source: 'newsletter & updates', utm_medium: 'email' };
    const expectedUrl = 'https://example.com/?utm_source=newsletter%20%26%20updates&utm_medium=email';
    expect(addUtmParams(url, utm)).toBe(expectedUrl);
  });

  it('should throw an error for invalid URL', () => {
    // This test checks that the function throws an error when an invalid URL is provided.
    const url = 'invalid-url';
    const utm = { utm_source: 'source' };
    expect(() => addUtmParams(url, utm)).toThrow(TypeError);
  });
});

// End of unit tests for: addUtmParams
