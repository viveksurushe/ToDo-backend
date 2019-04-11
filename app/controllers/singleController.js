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
const HistoryModel = mongoose.model('history');

let addlist = (req,res)=>{
    TodolistModel.findOne({ listName: req.body.listName })
    .exec((err, retriveUserDetails) => {
      if (err) {
        logger.error(err.message, 'singleController: addlist', 10);
        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(retriveUserDetails)) {
        let cListId=shortid.generate();
        let newTodolist = new TodolistModel({
          userId: req.body.userId,
          listId:cListId,
          listName:req.body.listName,
          addby:req.body.addby?req.body.addby:'',
          createdOn: time.now()
        });
        newTodolist.save((err, newList) => {
          if (err) {
            logger.error(err.message, 'singleController: addlist', 10)
            let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
            res.send(apiResponse)
          } else {
            let newListObj = newList.toObject();
            let newHistory=new HistoryModel({
              modal:'TodolistModel',
              query:'deleteOne({listId:'+cListId+'})'
            });
            newHistory.save((err,result)=>{
              if(err){
                logger.error(err.message, 'singleController: addlist,History', 10)
              }
            });
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
  TodolistModel.find({userId:req.body.userId})
  .lean()
  .exec((err,result)=>{
    if(err){
      logger.error(err.message,'singleController: getAllList',10);
      let apiResponse=response.generate(true,'Fail to get all List',500,null);
      res.send(apiResponse);
    } else if(check.isEmpty(result)){
      logger.info('No list found, singleController: getAllList');
      let apiResponse=response.generate(false,'No List! Add Some',300,null);
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
            if(result.listItem){
              let obj={"name":req.body.listItem,"status":"open","child":[]};
              // obj[req.body.listItem]=[{"status":"open","child":[]}];
              // result.listItem=obj;
              result.listItem.push(obj);
              resolve(result)
            }else{
              // result.listItem[req.body.listItem]=[{"status":"open","child":[]}];
              let obj={"name":req.body.listItem,"status":"open","child":[]};
              result.listItem=[];
              result.listItem.push(obj);
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
            result.listItem.splice(req.body.listItem, 1);
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
            result.listItem[req.body.key].name=req.body.listItem;
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

let done = (req,res)=>{
  let doneFind=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: done', 10);
            let apiResponse = response.generate(true, 'Failed To Add Todo', 500, null)
            reject(apiResponse)
          } else{
            result.listItem[req.body.key].status=req.body.status;
            resolve(result)
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
       }

    })
  }

  doneFind(req,res)
  .then(function(result){
    update(req,res,result,"updated")
  })
}

//for child elements
let childAdd=(req,res)=>{
  let childaddFind=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: addTodo', 10);
            let apiResponse = response.generate(true, 'Failed To Add Todo', 500, null)
            reject(apiResponse)
          } else{
            result.listItem[req.body.key].child.push(req.body.childItem);
            resolve(result)
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
      }

    })

  }

  childaddFind(req,res)
  .then(function(result){
    update(req,res,result,"updated")
  })
}

let childdelete=(req,res)=>{
  let delChildFind=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: childdelete', 10);
            let apiResponse = response.generate(true, 'Failed To Add Todo', 500, null)
            reject(apiResponse)
          } else{
            result.listItem[req.body.key].child.splice(req.body.ckey,1);
            resolve(result)
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
      }

    })

  }

  delChildFind(req,res)
  .then(function(result){
    update(req,res,result,"Deleted")
  })
}

let updateChild=(req,res)=>{
  let upChildFind=()=>{
    return new Promise((resolve,reject)=>{
      if(req.body.listId){
        TodolistModel.findOne({ listId: req.body.listId })
        .exec((err,result)=>{
          if (err) {
            logger.error(err.message, 'singleController: updateChild', 10);
            let apiResponse = response.generate(true, 'Failed To update Todo child', 500, null)
            reject(apiResponse)
          } else{
            result.listItem[req.body.key].child[req.body.ckey]=req.body.item;
            resolve(result)
          }
        });
      }else{
            let apiResponse = response.generate(true, '"listId" parameter is missing', 400, null)
            reject(apiResponse)
      }

    })

  }

  upChildFind(req,res)
  .then(function(result){
    update(req,res,result,"updated")
  })
}
module.exports = {
    addlist: addlist,
    getAllList:getAllList,
    deleteList:deleteList,
    updateList:updateList,
    addTodo:addTodo,
    getTodo:getTodo,
    deleteTodo:deleteTodo,
    updateTodo:updateTodo,
    done:done,
    childAdd:childAdd,
    childdelete:childdelete,
    updateChild:updateChild
  }// end exports