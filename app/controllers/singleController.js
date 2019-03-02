const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const token = require('../libs/tokenLib')
const check = require('../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib');
var EmailLib = require('../libs/emailLib');
var cookieParser = require('cookie-parser')

/* Models */
const TodolistModel = mongoose.model('todolist');

let addlist = (req,res)=>{
    TodolistModel.findOne({ listName: req.body.listName })
    .exec((err, retriveUserDetails) => {
      if (err) {
        logger.error(err.message, 'singleController: addlist', 10);
        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(retriveUserDetails)) {
        let newTodolist = new TodolistModel({
          userId: req.body.userId,
          listId:shortid.generate(),
          listName:req.body.listName,
          createdOn: time.now()
        });
        newTodolist.save((err, newList) => {
          if (err) {
            logger.error(err.message, 'singleController: addlist', 10)
            let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
            res.send(apiResponse)
          } else {
            let newListObj = newList.toObject();
            let apiResponse = response.generate(false, 'New Todo List Added', 200, null);
            res.send(apiResponse)
          }
        });
      } else {
        logger.error('User Cannot Be Created.User Already Present', 'singleController: addlist', 4);
        let apiResponse = response.generate(true, 'Todolist Already Present With this Name', 403, null);
        res.send(apiResponse);
      }
    });
}


module.exports = {
    addlist: addlist,
  }// end exports