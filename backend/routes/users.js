const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUserId,
  updateUser,
  updateUserAvatar,
  thisUser,
} = require('../controllers/users');
const { RegExp } = require('../utils/constants');

const auth = require('../middlewares/auth');

router.get('/', auth, getUser);

router.get('/me', auth, thisUser);

router.get('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserId);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(RegExp).required(),
  }),
}), updateUserAvatar);

module.exports = router;
