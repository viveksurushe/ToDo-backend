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
const HistoryModel = mongoose.model('history');
const TodolistModel = mongoose.model('todolist');


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
// let frdList =(req,res)=>{
//     ReuestModel.find({userId1:req.body.userId1,accept:true})
//     .select('_id userName2 userId2')
//     .exec((err, result) => {
//         if (err) {
//             console.log(err)
//             logger.error(err.message, 'userController: frdReq', 10)
//             let apiResponse = response.generate(true, 'Failed To Get  userlist', 500, null)
//             res.send(apiResponse)
//         } else if (check.isEmpty(result)) {
//             logger.info('No User Found', 'userController: getUserListFun')
//             let apiResponse = response.generate(true, 'No User Found', 200, null)
//             res.send(apiResponse)
//         } else {
//             let apiResponse = response.generate(false, 'Users Found', 200, result)
//             res.send(apiResponse)
//         }
//     })
// }// end of frdList

// start of sendReq function 
let sendReq =(req,res)=>{
    console.log("newSendReq",req.body);
    ReuestModel.find({})
    .exec((err, retriveUserDetails) => {
        if (err) {
            logger.error(err.message, 'multiController: sendReq', 10);
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
            logger.error(err.message, 'multiController: sendReq', 10)
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

// start of cancelReq function 
let cancelReq =(req,res)=>{
    
    ReuestModel.findOneAndRemove({_id:req.body.id},(err,result)=>{
        if(err){
            logger.error(err.message, 'multiController: cancelReq', 10)
            let apiResponse = response.generate(true, 'Failed to cancel request', 500, null)
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false, '', 200, null);
            res.send(apiResponse)
        }
    });
}// end of cancelReq

// start of acceptReq function 
let acceptReq =(req,res)=>{
    console.log(req.body);
    let newaccReq= new ReuestModel({
        userId1:req.body.userId2,
        userId2:req.body.userId1,
        userName1:req.body.userName2,
        userName2:req.body.userName1,
        send:true,
        accept:true
    });
    newaccReq.save();
    ReuestModel.findOneAndUpdate({userId1:req.body.userId1,userId2:req.body.userId2},{$set:{accept:true}},{new:true},(err,result)=>{
        if(err){
            logger.error(err.message, 'multiController: cancelReq', 10)
            let apiResponse = response.generate(true, 'Failed to Accept request', 500, null)
            res.send(apiResponse)
        }else{
            console.log(result);
            let apiResponse = response.generate(false, '', 200, null);
            res.send(apiResponse)
        }
    });
}// end of acceptReq

let undo=(req,res)=>{
    HistoryModel.find()
    .exec((err,result)=>{
        if(err){
            res.send({status:404});
        }else{

            let finaldata=result[result.length-1];
            //console.log("-->",finaldata);
            let apiResponse=response.generate(false,"get undo data",200,finaldata);
            res.send(apiResponse);
        }
    });
}

let undoDelete=(req,res)=>{
    HistoryModel.deleteOne({_id:req.query.id},(err,result)=>{});
}

let mgetAllList=async (req,res)=>{
    let arr=[];
    arr.push(req.body.userId1);
    await ReuestModel.find({userId1:req.body.userId1,accept:true,send:true})
    .select('userId2')
    .exec((err,result)=>{
        if(err){
            logger.error(err.message,'multiController: mgetAllList',10);
            let apiResponse=response.generate(true,'Fail to get all List',500,null);
            res.send(apiResponse);
        }else{
            for(val of result){
                arr.push(val.userId2);
            }
        }
    });

    await TodolistModel.find({userId:{$in:arr}})
    .lean()
    .exec((err,result)=>{
        if(err){
        logger.error(err.message,'multiController: mgetAllList',10);
        let apiResponse=response.generate(true,'Fail to get all List',500,null);
        res.send(apiResponse);
        } else if(check.isEmpty(result)){
        logger.info('No list found, multiController: mgetAllList');
        let apiResponse=response.generate(false,'No List! Add Some',300,null);
        res.send(apiResponse);
        }else{
        let apiResponse=response.generate(false,'',200,result);
        res.send(apiResponse);
        }
    });
}

let unfriend = (req,res)=>{

    ReuestModel.deleteMany({userId1: {$in: [req.body.userId1, req.body.userId2]},userId2: {$in: [req.body.userId2, req.body.userId1]}},(err,result)=>{
        if(err){
            let apiResponse = response.generate(true, 'Failed to Unfriend', 500, null)
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false, '', 200, null);
            res.send(apiResponse)
        }
    });
 
}
module.exports = {
    frdReq: frdReq,
    //frdList:frdList,
    sendReq:sendReq,
    cancelReq:cancelReq,
    undoDelete:undoDelete,
    undo:undo,
    mgetAllList:mgetAllList,
    acceptReq:acceptReq,
    unfriend:unfriend
  }// end exports