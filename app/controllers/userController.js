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
const UserModel = mongoose.model('users');
const AuthModel = mongoose.model('Auth');


// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
      return new Promise((resolve, reject) => {
        if (req.body.email) {
          if (!validateInput.Email(req.body.email)) {
            let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null);
            reject(apiResponse);
          } else if (check.isEmpty(req.body.password)) {
            let apiResponse = response.generate(true, 'password parameter is missing"', 400, null)
            reject(apiResponse)
          } else {
            resolve(req)
          }
        } else {
          logger.error('Field Missing During User Creation', 'userController: createUser()', 5);
          let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null);
          reject(apiResponse);
        }
  
      })//promise end here
    }//user inout validation end
  
    let createUser = () => {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: req.body.email })
          .exec((err, retriveUserDetails) => {
            if (err) {
              logger.error(err.message, 'userController: createUser', 10);
              let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(retriveUserDetails)) {
              let newUser = new UserModel({
                userId: shortid.generate(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                countyCode:req.body.countyCode,
                phone: req.body.phone,
                role: req.body.role,
                password: passwordLib.hashpassword(req.body.password),
                createdOn: time.now()
              });
              newUser.save((err, newUser) => {
                if (err) {
                  logger.error(err.message, 'userController: createUser', 10)
                  let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                  reject(apiResponse)
                } else {
                  let newUserObj = newUser.toObject();
                  resolve(newUserObj)
                }
              });
            } else {
              logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4);
              let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null);
              reject(apiResponse);
            }
          })
      })
    }//end create user fun
    
    validateUserInput(req, res)
      .then(createUser)
      .then((resolve) => {
          let emailBody=require('fs').readFileSync('./app/middlewares/emailBody/signup.html', 'utf8');
          emailBody=emailBody.replace(/__NAME__/g,req.body.firstName+" "+req.body.lastName);
          emailBody=emailBody.replace(/__EMAIL__/g,req.body.email);
          EmailLib.emailSend({to:req.body.email,subject:"Signup Successful",text:'hello',html:emailBody});
          delete resolve.password
          let apiResponse = response.generate(false, 'User created', 200, resolve)
          res.send(apiResponse)
      })
      .catch((err) => {
        res.send(err);
      })
  }// end user signup function 

// start of login function 
let signinFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10);
                        console.log("userDetails",userDetails);
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    
    let validatePassword = (retrievedUserDetails) => {
      console.log("validatePassword",retrievedUserDetails);
      return new Promise((resolve, reject) => {
          passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
              console.log("isMatch",isMatch)
              if (err) {
                  console.log(err)
                  logger.error(err.message, 'userController: validatePassword()', 10)
                  let apiResponse = response.generate(true, 'Login Failed', 500, null)
                  reject(apiResponse)
              } else if (isMatch) {
                  let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                  delete retrievedUserDetailsObj.password
                  delete retrievedUserDetailsObj._id
                  delete retrievedUserDetailsObj.__v
                  delete retrievedUserDetailsObj.createdOn
                  delete retrievedUserDetailsObj.modifiedOn
                  resolve(retrievedUserDetailsObj)
              } else {
                  logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                  let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                  reject(apiResponse)
              }
          })
      })
  }
  
    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }
   
          findUser(req,res)
          .then(validatePassword)
          .then(generateToken)
          .then(saveToken)
          .then((resolve) => {
            console.log("inside resolve",resolve);
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errror=>",err);
            res.status(err.status)
            res.send(err)
        })
  }
  // end of the login function 

// start of logout function 
let logout = (req, res) => {
    AuthModel.findOneAndRemove({userId: req.body.userId}, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
      })
} // end of the logout function.

// start of sendVeriCode function 
let sendVeriCode = (req,res) =>{
    let verfiyUser = () => {
        return new Promise((resolve, reject) => {
          UserModel.findOne({ email: req.body.email })
            .exec((err, retriveUserDetails) => {
              if (err) {
                logger.error(err.message, 'userController: sendVeriCode', 10);
                let apiResponse = response.generate(true, 'Failed To Check Register Mail', 500, null)
                res.send(apiResponse)
              } else if (check.isEmpty(retriveUserDetails)) {
                logger.error('empty no user present', 'userController: sendVeriCode', 10)
                let apiResponse = response.generate(true, 'Email is not Registered,Enter Registered Mail', 500, null)
                res.send(apiResponse)
              } else {
                let apiResponse = response.generate(false, 'Mail Send Successful', 200, null);
                resolve(apiResponse);
              }
            })
        })
      }//end verfiyUser fun

      verfiyUser(req,res)
      .then((resolve) => {
        let verificationCode=shortid.generate();
        UserModel.findOneAndUpdate({email:req.body.email}, {$set:{verifiCode:verificationCode}}, {new: true}, (err, doc) => {
            if (err) {
                logger.error('Something wrong when updating data!', 'userController: sendVeriCode', 10);
            }else{
                let emailBody=require('fs').readFileSync('./app/middlewares/emailBody/forget.html', 'utf8');
                emailBody=emailBody.replace(/__CODE__/g,verificationCode);
                EmailLib.emailSend({to:req.body.email,subject:"Verification Code",text:'hello',html:emailBody});
                //let apiResponse = response.generate(false, 'Mail Send Successful', 200, null)
                res.send(resolve);
            }
        });
        
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.status(err.status)
        res.send(err)
    })
}
// end of the sendVeriCode function 

// start of getCode function 
let getCode = (req, res) => {
    UserModel.findOne({ email: req.body.email })
    .exec((err, result) => {
        
        if (err) {
            console.log(err)
            logger.error(err.message, 'userController: getCode', 10)
            let apiResponse = response.generate(true, 'Failed To Get  verification code', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'userController: getCode')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Verification Code Found', 200, result)
            res.send(apiResponse)
        }
    })
}// end of the getCode function 

// start of updatePass function 
let updatePass = (req,res) =>{
    let verfiyUser = () => {
        return new Promise((resolve, reject) => {
          UserModel.findOne({ email: req.body.email })
            .exec((err, retriveUserDetails) => {
              if (err) {
                logger.error(err.message, 'userController: sendVeriCode', 10);
                let apiResponse = response.generate(true, 'Failed To Check Register Mail', 500, null)
                res.send(apiResponse)
              } else if (check.isEmpty(retriveUserDetails)) {
                logger.error('empty no user present', 'userController: sendVeriCode', 10)
                let apiResponse = response.generate(true, 'Email is not Registered,Enter Registered Mail', 500, null)
                res.send(apiResponse)
              } else {
                let apiResponse = response.generate(false, 'Email verification Succfully', 200, null);
                resolve(apiResponse);
              }
            })
        })
      }//end verfiyUser fun

      verfiyUser(req,res)
      .then((resolve) => {
        UserModel.findOneAndUpdate({email:req.body.email,userId:req.body.userId}, {$set:{password:passwordLib.hashpassword(req.body.password)}}, {new: true}, (err, doc) => {
            if (err) {
                logger.error('Something wrong when updating data!', 'userController: sendVeriCode', 10);
                let apiResponse = response.generate(true, 'Failed To Update password', 500, null)
                res.send(err)
            }else{
                let emailBody=require('fs').readFileSync('./app/middlewares/emailBody/passupdate.html', 'utf8');
                emailBody=emailBody.replace(/__EMAIL__/g,req.body.email);
                emailBody=emailBody.replace(/__PASSWORD__/g,req.body.password);
                EmailLib.emailSend({to:req.body.email,subject:"Your Password has been changed! ",text:'hello',html:emailBody});
                let apiResponse = response.generate(false, 'Password Updated SuccessFully', 200, null)
                res.send(apiResponse)
            }
            
        });
       
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.status(err.status)
        res.send(err)
    })
}// end of updatePass


module.exports = {
    signUpFunction: signUpFunction,
    signinFunction: signinFunction,
    logout: logout,
    sendVeriCode:sendVeriCode,
    getCode:getCode,
    updatePass:updatePass
  }// end exports