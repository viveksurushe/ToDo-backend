const mongoose = require('mongoose');
const Schema = mongoose.Schema
const time = require('../libs/timeLib');

const EmailSchema = new Schema({
  eamil: {
    type: String
  },
  subject: {
    type: String
  },
  body: {
    type: String
  },
  sent_stamp: {
    type: Date,
    default: time.now()
  }
})

mongoose.model('email_log', EmailSchema)
