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

let addTodo=(req,res)=>{
  let find=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: addTodo', 10);
            let apiResponse = response.generate(true, 'Failed To Add Todo', 500, null)
            reject(apiResponse)
          } else{
            if(result.listItem == ""){
              let obj={};
              obj[req.body.listItem]=[];
              result.listItem=obj;
              resolve(result)
            }else{
              result.listItem[req.body.listItem]=[];
              resolve(result);
            }
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
       }

    })

  }

  let update=(result)=>{
    TodolistModel.findOneAndUpdate({listId:req.body.listId},{"$set":{"listItem":result.listItem}},{new:true},(err,doc)=>{
      if(err){
        logger.error('Something wrong when updating data!', 'singleController: update', 10);
        let apiResponse = response.generate(true, 'Failed To Update Todo', 500, null)
        res.send(apiResponse)
      }else{
        let apiResponse = response.generate(false, 'List Item Updated Succefully', 200, null)
        res.send(apiResponse)
      }
    });
  }

  find(req,res)
  .then(update)
  
  
}

let getTodo=(req,res)=>{
  TodolistModel.findOne({ listId: req.body.listId })
  .exec((err, retriveUserDetails) => {
    if (err) {
      logger.error(err.message, 'singleController: getTodo', 10);
      let apiResponse = response.generate(true, 'Failed To get Todo', 500, null)
      res.send(apiResponse)
    } else {
      logger.error('getting todo', 'singleController: getTodo', 4);
      let apiResponse = response.generate(true, 'Todo data', 200, retriveUserDetails);
      res.send(apiResponse);
    }
  });
}

let deleteTodo=(req,res)=>{
  let delFind=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: addTodo', 10);
            let apiResponse = response.generate(true, 'Failed To Add Todo', 500, null)
            reject(apiResponse)
          } else{
            delete result.listItem[req.body.listItem];
            resolve(result)
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
       }

    })

  }

  delFind(req,res)
  .then(function(result){
    update(req,res,result,"Deleted")
  })
}

let updateTodo=(req,res)=>{
  let upFind=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: addTodo', 10);
            let apiResponse = response.generate(true, 'Failed To Add Todo', 500, null)
            reject(apiResponse)
          } else{
            result.listItem[req.body.listItem]=result.listItem[req.body.oldItem]
            delete result.listItem[req.body.oldItem];
            resolve(result)
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
       }

    })

  }

  upFind(req,res)
  .then(function(result){
    update(req,res,result,"updated")
  })
}
let update=(req,res,result,type)=>{
  TodolistModel.findOneAndUpdate({listId:req.body.listId},{"$set":{"listItem":result.listItem}},{new:true},(err,doc)=>{
    if(err){
      logger.error('Something wrong when updating data!', 'singleController: update', 10);
      let apiResponse = response.generate(true, 'Failed To '+type+' Todo', 500, null)
      res.send(apiResponse)
    }else{
      let apiResponse = response.generate(false, 'List Item '+type+' Succefully', 200, null)
      res.send(apiResponse)
    }
  });
}
module.exports = {
    addlist: addlist,
    getAllList:getAllList,
    deleteList:deleteList,
    updateList:updateList,
    addTodo:addTodo,
    getTodo:getTodo,
    deleteTodo:deleteTodo,
    updateTodo:updateTodo
  }// end exports