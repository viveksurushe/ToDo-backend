'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: ''
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  countyCode:{
    type:String,
    default:''
  },
  phone: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: 0
  },
  password: {
    type: String,
    default: ''
  },
  verifiCode: {
    type: String,
    default: ''
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('users', userSchema);
