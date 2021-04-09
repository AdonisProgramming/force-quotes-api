const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const getQuotes = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "./quotes.json"));
    const quotes = JSON.parse(data);
    const val = req.params.character;
    console.log(val);
    const characterQuote = quotes.filter( (quote) => quote.character === req.params.character);
    if (!characterQuote) {
      const err = new Error('character not found');
      err.status = 404;
      throw err;
    }
    res.json(characterQuote);
  } catch (e) {
    next(e);
  }
};

router.route("/api/v1/quotes/:character").get(getQuotes);

module.exports = router;


const createQuote = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './quotes.json'));
    const quotes = JSON.parse(data);
    const newCharacterQuote = {
      movie: req.body.movie,
      character: req.body.character,
      quote: req.body.quote,
    };
    quotes.push(newCharacterQuote);
    fs.writeFileSync(path.join(__dirname, './quotes.json'), JSON.stringify(quotes));
    res.status(201).json(newCharacterQuote);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/quotes')
  .post(createQuote);


const updateQuote = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './quotes.json'));
    const quotes = JSON.parse(data);
    const characterQuote = quotes.find(quote => quote.character === String(req.params.character));
    if (!characterQuote) {
      const err = new Error('character not found');
      err.status = 404;
      throw err;
    }
    const newCharacterQuote = {
      movie: req.body.movie,
      character: req.body.character,
      quote: req.body.quote,
    };
    const newQuote = quotes.map(quote => {
      if (quote.character === String(req.params.character)) {
        return newCharacterQuote;
      } else {
        return quote;
      }
    })
    fs.writeFileSync(path.join(__dirname, './quotes.json'), JSON.stringify(newQuote));
    res.status(200).json(newCharacterQuote);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/quotes/:character')
  .get(getQuotes)
  .put(updateQuote);

const deleteQuote = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './quotes.json'));
    const quotes = JSON.parse(data);
    const characterQuote = quotes.find(quote => quote.character === String(req.params.character));
    if (!characterQuote) {
      const err = new Error('character not found');
      err.status = 404;
      throw err;
    }
    const newQuote = quotes.map(quote => {
      if (quote.character === String(req.params.character)) {
        return null;
      } else {
        return quote;
      }
    })
    fs.writeFileSync(path.join(__dirname, './quotes.json'), JSON.stringify(newQuote));
    res.status(200).end();
  } catch (e) {
    next(e);

  }
};

router
  .route('/api/v1/quotes/:character')
  .get(getQuotes)
  .put(updateQuote)
  .delete(deleteQuote);

module.exports = router;
