var createToken = require('./src/index').createToken;
var isTokenValid = require('./src/index').isTokenValid;

exports.default = {
  createToken: createToken,
  isTokenValid: isTokenValid
};
