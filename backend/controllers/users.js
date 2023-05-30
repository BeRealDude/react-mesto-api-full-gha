const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { NODE_ENV, SECRET_SIGNING_KEY } = require('../config');
const User = require('../models/user');
const AccountUsed = require('../error/account-used');
const PageNotFound = require('../error/page-not-found');
const IncorrectData = require('../error/incorrect-data');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) return res.send(user);
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.thisUser = (req, res, next) => {
  const { _id: idUser } = req.user;
  User.findById(idUser)
    .then((user) => {
      if (user) return res.status(200).send(user);
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'asdf', { expiresIn: '7d' });
      res.status(200).send({ token, message: 'Авторизация прошла успешна' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(201).send({ email: user.email, _id: user._id });
    })
    .catch((err) => {
      if (err.code === 11000) { // Нет-нет, всё хорошо. Заработало после удаления коллекций в базе
        next(new AccountUsed('Аккаунт с этой почтой уже существует'));
      } if (err.name === 'ValidationError') {
        next(new IncorrectData('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send(user);
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send(user);
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      next(err);
    });
};
