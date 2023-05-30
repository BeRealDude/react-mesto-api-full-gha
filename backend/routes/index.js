const router = require('express').Router();

const PageNotFound = require('../error/page-not-found');

const signupRoute = require('./signup');
const signinRoute = require('./signin');
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/', signupRoute);
router.use('/', signinRoute);

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

router.use((req, res, next) => next(new PageNotFound('Страница не найдена')));

module.exports = router;
