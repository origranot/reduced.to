import { createUtmObject, addUtmParams } from './utm';

describe('createUtmObject', () => {
  test('returns undefined if utmFields is empty', () => {
    expect(createUtmObject({})).toBeUndefined();
  });

  test('returns an object with non-empty utm values', () => {
    const utmFields = {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: '',
    };
    const expected = {
      utm_source: 'google',
      utm_medium: 'cpc',
    };
    expect(createUtmObject(utmFields)).toEqual(expected);
  });

  test('ignores properties with empty or undefined values', () => {
    const utmFields = {
      utm_source: '',
      utm_medium: undefined,
      utm_campaign: 'launch',
    };
    const expected = {
      utm_campaign: 'launch',
    };
    expect(createUtmObject(utmFields)).toEqual(expected);
  });
});

describe('addUtmParams', () => {
  const baseUrl = 'https://example.com/';

  test('appends UTM parameters to a URL', () => {
    const utm = {
      utm_source: 'newsletter',
      utm_medium: 'email',
    };
    const expectedUrl = 'https://example.com/?utm_source=newsletter&utm_medium=email';
    expect(addUtmParams(baseUrl, utm)).toBe(expectedUrl);
  });

  test('handles URLs with existing parameters', () => {
    const url = 'https://example.com/?ref=affiliate';
    const utm = {
      utm_source: 'newsletter',
      utm_medium: 'email',
    };
    const expectedUrl = 'https://example.com/?ref=affiliate&utm_source=newsletter&utm_medium=email';
    expect(addUtmParams(url, utm)).toBe(expectedUrl);
  });

  test('handles empty UTM object', () => {
    expect(addUtmParams(baseUrl, {})).toBe(baseUrl);
  });
});
