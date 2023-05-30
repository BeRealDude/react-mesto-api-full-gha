require('dotenv').config();

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorCenter } = require('./middlewares/error-center');

const routes = require('./routes');

const { PORT, DB_ADDRESS } = require('./config');

const app = express();
app.use(express.json());

const limiter = rateLimit({
  max: 10000, // Перед сдачей исправить на 200!!!
  windowMs: 60 * 60 * 1000,
  message: 'Слишком много запросов с этого IP-адреса',
});

app.use(cors());

app.use(helmet());

mongoose.connect(DB_ADDRESS);

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorCenter);

app.listen(PORT);
