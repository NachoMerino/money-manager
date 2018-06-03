const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const balanceSchema = new Schema({
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

const Balance = mongoose.model('balance', balanceSchema);
module.exports = Balance;