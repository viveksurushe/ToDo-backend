'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let todolistSchema = new Schema({
  userId: {
    type: String,
    default: ''
  },
  addby: {
    type: String,
    default: ''
  },
  listId: {
    type: String,
    default: ''
  },
  listName:{
    type:String,
    default:''
  },
  createdOn :{
    type:Date,
    default:""
  }
})


mongoose.model('todolist', todolistSchema);
