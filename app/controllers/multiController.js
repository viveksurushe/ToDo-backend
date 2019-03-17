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
var cookieParser = require('cookie-parser');

/* Models */
const ReuestModel = mongoose.model('request');


// start of frdReq function 
let frdReq =(req,res)=>{
    ReuestModel.find({})
    .exec((err, result) => {
        
        if (err) {
            console.log(err)
            logger.error(err.message, 'userController: frdReq', 10)
            let apiResponse = response.generate(true, 'Failed To Get  userlist', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'userController: getUserListFun')
            let apiResponse = response.generate(true, 'No User Found', 200, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Users Found', 200, result)
            res.send(apiResponse)
        }
    })
}// end of frdReq

// start of frdList function 
let frdList =(req,res)=>{
    ReuestModel.find({userId1:req.body.userId1,accept:true})
    .select('userName2 userId2')
    .exec((err, result) => {
        
        if (err) {
            console.log(err)
            logger.error(err.message, 'userController: frdReq', 10)
            let apiResponse = response.generate(true, 'Failed To Get  userlist', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'userController: getUserListFun')
            let apiResponse = response.generate(true, 'No User Found', 200, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Users Found', 200, result)
            res.send(apiResponse)
        }
    })
}// end of frdList

// start of sendReq function 
let sendReq =(req,res)=>{
    console.log("newSendReq",req.body);
    ReuestModel.find({})
    .exec((err, retriveUserDetails) => {
        if (err) {
            logger.error(err.message, 'singleController: addlist', 10);
            let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
            res.send(apiResponse)
        } 
        let newSendReq= new ReuestModel({
            userId1:req.body.userId1,
            userId2:req.body.userId2,
            userName1:req.body.userName1,
            userName2:req.body.userName2,
            send:true
        });
        newSendReq.save((err, newList) => {
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
      
    });
}// end of sendReq

module.exports = {
    frdReq: frdReq,
    frdList:frdList,
    sendReq:sendReq
  }// end exports