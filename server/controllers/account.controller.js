const Account = require('../models/account.model');
const moment = require('moment');
require('moment/locale/en-gb.js');

const year = moment().format('YYYY')
const month = moment().format('MM')

exports.create = (req, res) => {
  if (!req.body) {
    return res.send('You send me empty data');
  }
  const newAccount = new Account({
    balance: req.body.balance,
    name: req.body.name,
    movements: {
      [year]:{
        [month]: req.body.movements
      }
    }
  });
  newAccount.save((err) => { if (err) throw err });
  res.send({ message: `Account ${req.body.name} has been created` });
};

exports.delete = (req, res) => {
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
  Account.findById(req.params.accountId, (err, account) => {
    account.remove((err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.json({ message: 'Account has been successfully deleted' });
};

exports.findAll = (req, res) => {
  Account.find((err, data) => {
    if (err) {
      res.status(500).send({ error: 'some error occurred while retrieving data' });
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
  const bodyDate = req.body.date.split('/')
  const bodyMonth = bodyDate[1]
  const bodyYear =  bodyDate[2]

  Account.findById(req.params.accountId, (err, account) => {
    // new data to add
    const dataToAdd = ({ date: req.body.date, description: req.body.description, amount: req.body.amount, categorie: req.body.categorie });

    if(account.movements[bodyYear]){  
      if(account.movements[bodyYear][bodyMonth]){
          //console.log('all fine we still in the same bodyMonth')
          account.movements[bodyYear][bodyMonth] = [...account.movements[bodyYear][bodyMonth], dataToAdd]
        } else {
          //console.log('account NOT founded, creating new bodyMonth')
          account.movements[bodyYear][bodyMonth] = [dataToAdd]
        }
      } else {
        //console.log('account NOT founded, creating new bodyYear')
        account.movements[bodyYear] = {[bodyMonth]:[dataToAdd]}
      }
    
    account.balance = req.body.balance;
    account.markModified('movements')
    account.save((err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.json({ message: 'Movement has been added successfully' });
};

exports.offlineupdate = (req, res) => {
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
  req.body.map(account => {return(
    Account.findByIdAndUpdate(account._id, account, {multi: true}, (err, account) => {if(err) throw err})
    )})
  res.json({ message: 'DB has been updated successfully with offline data' });
};
