const Balance = require('../models/balance.model');
const moment = require('moment');
require('moment/locale/en-gb.js');

exports.create = (req, res) => {
  if (!req.body) {
    return res.send('You send me empty data');
  }
  const newAccount = new Balance({
    balance: req.body.balance,
    name: req.body.name,
    movements: req.body.movements
  });
  newAccount.save((err) => {
    if (err) {
      throw err;
    }
  });
  res.send({ message: 'has been saved successfully' });
};

exports.findAll = (req, res) => {
  Balance.find((err, data) => {
    if (err) {
      res.status(500).send({ error: 'some error occurred while retrieving data' });
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  const currentDate = moment().format('L')
  console.log('today is:',currentDate)
  console.log('req.params', req.params)
  console.log('req.body', req.body)
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
  Balance.findById(req.params.balanceId, (err, balance) => {
    //
    console.log('founded',balance)

    const separateDate = req.body.date.split('/')
    const getMonth = separateDate[1]
    const getYear = separateDate[2]
    console.log(`actual month is ${getMonth} and the year is ${getYear}`)
    //
    balance.balance = req.body.balance;
    balance.movements = [...balance.movements,{ date: req.body.date, description: req.body.description, amount: req.body.amount, categorie: req.body.categorie }];
    balance.save((err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.json({ message: 'Movement has been added successfully' });
};
