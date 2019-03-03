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

let getAllList =(req,res)=>{
  TodolistModel.find()
  .lean()
  .exec((err,result)=>{
    if(err){
      logger.error(err.message,'singleController: getAllList',10);
      let apiResponse=response.generate(true,'Fail to get all List',500,null);
      res.send(apiResponse);
    } else if(check.isEmpty(result)){
      logger.info('No list found, singleController: getAllList');
      let apiResponse=response.generate(true,'No List Found',404,null);
      res.send(apiResponse);
    }else{
      let apiResponse=response.generate(false,'List Found',200,result);
      res.send(apiResponse);
    }
  });

}

let deleteList=(req,res)=>{
  TodolistModel.deleteOne({listId:req.body.listId},(err,result)=>{
    if(err){
      logger.error(err.response,'singleController: deleteList',10);
      let apiResponse=response.generate(true,'Fail to delete List',500,null);
      res.send(apiResponse);
    }else if(check.isEmpty(result)){
      let apiResponse=response.generate(true,'result is empty',404,null);
      res.send(apiResponse);
    }else{
      let apiResponse=response.generate(false,'List Deleted Successfully',200,null);
      res.send(apiResponse);
    }
  });
}

let updateList=(req,res)=>{
  console.log(req.body);
  TodolistModel.findOneAndUpdate({listId:req.body.listId},{"$set":{"listName":req.body.listName}},{new:true},(err,doc)=>{
    if(err){
      logger.error('Something wrong when updating data!', 'meetingController: updateMeetingFun', 10);
      let apiResponse = response.generate(true, 'Failed To Update Meeting', 500, null)
      res.send(apiResponse)
    }else{
      let apiResponse = response.generate(false, 'List Name Updated Succefully', 200, null)
      res.send(apiResponse)
    }
  });
}

module.exports = {
    addlist: addlist,
    getAllList:getAllList,
    deleteList:deleteList,
    updateList:updateList
  }// end exports