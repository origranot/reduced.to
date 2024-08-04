// Unit tests for: createUtmObject

import { createUtmObject } from '../utm';

describe('createUtmObject() createUtmObject method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return an object with valid UTM fields when all fields are provided', () => {
      const utmFields = {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring_sale',
        utm_term: 'shoes',
        utm_content: 'ad1',
      };
      const result = createUtmObject(utmFields);
      expect(result).toEqual(utmFields);
    });

    it('should return an object with only non-empty UTM fields', () => {
      const utmFields = {
        utm_source: 'google',
        utm_medium: '',
        utm_campaign: 'spring_sale',
        utm_term: null,
        utm_content: 'ad1',
      };
      const expected = {
        utm_source: 'google',
        utm_campaign: 'spring_sale',
        utm_content: 'ad1',
      };
      const result = createUtmObject(utmFields);
      expect(result).toEqual(expected);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should return undefined when no UTM fields are provided', () => {
      const result = createUtmObject({});
      expect(result).toBeUndefined();
    });

    it('should return undefined when UTM fields are null', () => {
      const result = createUtmObject(null);
      expect(result).toBeUndefined();
    });

    it('should return undefined when UTM fields are undefined', () => {
      const result = createUtmObject(undefined);
      expect(result).toBeUndefined();
    });

    it('should return an empty object when all UTM fields are empty strings', () => {
      const utmFields = {
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_term: '',
        utm_content: '',
      };
      const result = createUtmObject(utmFields);
      expect(result).toEqual({});
    });

    it('should handle UTM fields with boolean values', () => {
      const utmFields = {
        utm_source: 'google',
        utm_medium: true as any, // Type assertion to simulate unexpected type
        utm_campaign: 'spring_sale',
      };
      const expected = {
        utm_source: 'google',
        utm_campaign: 'spring_sale',
      };
      const result = createUtmObject(utmFields);
      expect(result).toEqual(expected);
    });

    it('should handle UTM fields with numeric values', () => {
      const utmFields = {
        utm_source: 'google',
        utm_medium: 123 as any, // Type assertion to simulate unexpected type
        utm_campaign: 'spring_sale',
      };
      const expected = {
        utm_source: 'google',
        utm_campaign: 'spring_sale',
      };
      const result = createUtmObject(utmFields);
      expect(result).toEqual(expected);
    });
  });
});

// End of unit tests for: createUtmObject
