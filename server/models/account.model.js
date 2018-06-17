const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: moment().format('L'),
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  movements: Schema.Types.Mixed
});

const Account = mongoose.model('accounts', accountSchema);
module.exports = Account;
