const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const PageNotFound = require('./error/page-not-found');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorCenter } = require('./middlewares/error-center');

const routerSignup = require('./routes/signup');
const routerSignin = require('./routes/signin');

const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

const limiter = rateLimit({
  max: 10000, // Перед сдачей исправить на 200!!!
  windowMs: 60 * 60 * 1000,
  message: 'Слишком много запросов с этого IP-адреса',
});

app.use(cors());

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(requestLogger);

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routerSignup);
app.use('/', routerSignin);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res, next) => {
  next(new PageNotFound('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorCenter);

app.listen(PORT);
