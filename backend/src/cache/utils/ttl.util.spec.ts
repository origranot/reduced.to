import { convertExpirationTimeToTtl } from './ttl.util';

describe('TtlUtil', () => {
  describe('convertExpirationTimeToTtl', () => {
    it('should return null if expirationTime has falsy value', () => {
      const expirationTime = null;
      const ttl = convertExpirationTimeToTtl(expirationTime);
      expect(ttl).toBeNull();
    });

    it('should return null if expiration time is earlier than now', () => {
      const expirationTime = new Date('2021-01-01');
      const ttl = convertExpirationTimeToTtl(expirationTime);
      expect(ttl).toBeNull();
    });

    it('should return ttl if expiration time is bigger than now', () => {
      const expirationTime = new Date(Date.now() * 100);
      const ttl = convertExpirationTimeToTtl(expirationTime);
      expect(ttl).toBeDefined();
      expect(ttl).toBeGreaterThan(0);
      expect(typeof ttl).toBe('number');
    });
  });
});
