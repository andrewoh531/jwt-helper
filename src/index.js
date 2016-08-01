import jwt from 'jsonwebtoken';

function createToken(issuer, audience, expiryInSeconds, secret, userId) {
  const payload = {userId};
  const options = {issuer, audience, expiresIn: `${expiryInSeconds}s`};
  return jwt.sign(payload, secret, options);
}

function isTokenValid(token, issuer, audience, secret) {
  try {
    const decoded = jwt.verify(token, secret, {issuer, audience});
    return {userId: decoded.userId, isValid: true};
  } catch (err) {
    return {
      isValid: false,
      error: err.name,
      msg: err.message
    };
  }
}

export {
  createToken,
  isTokenValid
};
