import {expect} from 'chai';
import jwt from 'jsonwebtoken';

import {createToken, isTokenValid} from '../src/index';

describe('JwtService', () => {

  const userId = 'userId';
  const jwtSecret = 'jwtSecret64_';
  const audience = 'habit-tracker';
  const issuer = 'lificient';

  describe('create token', () => {
    it('should create a valid token', () => {
      const jwtToken = createToken(issuer, audience, 1, jwtSecret, userId);
      expect(jwtToken).to.be.ok;

      const decodedToken = jwt.verify(jwtToken, jwtSecret);
      expect(decodedToken).to.be.ok;
      expect(decodedToken.aud).to.equal(audience);
    });
  });

  describe('isTokenValid', () => {
    const validToken = jwt.sign({}, jwtSecret, {expiresIn: '1 day', issuer, audience});

    it('shold return true when token is valid', () => {
      const response = isTokenValid(validToken, issuer, audience, jwtSecret);
      expect(response.isValid).to.be.true;
    });

    it('shold return false when issuer is invalid', () => {
      const response = isTokenValid(validToken, 'invalid_issuer', audience, jwtSecret);
      expect(response.isValid).to.be.false;
      expect(response.error).to.equal('JsonWebTokenError');
      expect(response.msg).to.equal('jwt issuer invalid. expected: invalid_issuer');
    });

    it('shold return false when audience is invalid', () => {
      const response = isTokenValid(validToken, issuer, 'invalid audience', jwtSecret);
      expect(response.isValid).to.be.false;
      expect(response.error).to.equal('JsonWebTokenError');
      expect(response.msg).to.equal('jwt audience invalid. expected: invalid audience');
    });

    it('should return false if expired', () => {
      const expiredToken = jwt.sign({}, jwtSecret, {expiresIn: '0'});
      const isTokenValidResult = isTokenValid(expiredToken, issuer, audience, jwtSecret);
      expect(isTokenValidResult.isValid).to.be.false;
    });

    it('should return false if signature does not match due to invalid signature', () => {
      expect(isTokenValid(validToken, audience, 'invalidSecret').isValid).to.be.false;
    });

  });
});
