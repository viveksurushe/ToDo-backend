'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let historySchema = new Schema({
    modal: {
        type: String,
        default: ''
    },
    query: {
        type: String,
        default: ''
    },
    queryObj: {
        type: Object,
        default: ''
    }
})


mongoose.model('history', historySchema);
