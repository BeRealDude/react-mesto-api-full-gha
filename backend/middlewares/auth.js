const jwt = require('jsonwebtoken');
const { NODE_ENV, SECRET_SIGNING_KEY } = require('../config');
const IncorrectToken = require('../error/incorrect-token');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new IncorrectToken('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'asdf');
  } catch (err) {
    return next(new IncorrectToken('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
