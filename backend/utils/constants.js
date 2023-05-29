const { NODE_ENV } = process.env;
const { SECRET_SIGNING_KEY } = process.env;

const RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

module.exports = {
  NODE_ENV,
  SECRET_SIGNING_KEY,
  RegExp,
};
