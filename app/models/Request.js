'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let requestSchema = new Schema({
    userId1: {
        type: String,
        default: ''
    },
    userId2: {
        type: String,
        default: ''
    },
    userName1: {
        type: String,
        default: ''
    },
    userName2: {
        type: String,
        default: ''
    },
    send: {
        type: Boolean,
        default: false
    },
    accept: {
        type: Boolean,
        default: false
    }
})


mongoose.model('request', requestSchema);
