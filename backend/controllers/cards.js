const Card = require('../models/card');
const PageNotFound = require('../error/page-not-found');
const IncorrectData = require('../error/incorrect-data');
const NoAccess = require('../error/no-access');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: idUser } = req.user;

  Card.create({ name, link, owner: idUser })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectData('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

module.exports.deleteCard = async (req, res, next) => {
  const { _id: idUser } = req.user;
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) throw new PageNotFound('Карточка с указанным id не найдена.');
    const { owner: cardIdowner } = card;
    if (cardIdowner.valueOf() !== idUser) {
      throw new NoAccess('Недоступно');
    } else {
      await card.deleteOne();
      res.send({ message: 'Карточка удалена.' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectData('Указан некорректный id при удалении карточки.'));
    } else { next(err); }
  }
  return true;
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: idUser } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: idUser } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new PageNotFound('Передан несуществующий id карточки');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для постановки лайка'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: idUser } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: idUser } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new PageNotFound('Передан несуществующий id карточки');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для снятия лайка'));
      }
      next(err);
    });
};
