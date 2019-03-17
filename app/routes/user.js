const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.


    // params: firstName, lastName, email, countyCode, phone, role, password, passConf
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup USERS
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} countyCode countyCode of the user. (body params) (required)
     * @apiParam {string} phone Phone Number of the user. (body params) (required)
     * @apiParam {string} role role of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} passConf passConf of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "User created",
                    "status": 200,
                    "data": {
                                "__v": 0,
                                "_id": "5c62a0ca29d86c21ea76bfd5",
                                "createdOn": "2019-02-12T10:32:42.000Z",
                                "verifiCode": "",
                                "role": "user",
                                "phone": 9812131412,
                                "countyCode": "91",
                                "email": "nutan@gmail.com",
                                "lastName": "Kore",
                                "firstName": "Nutan",
                                "userId": "HGY2eMlOa"
                    }
                }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.signinFunction);

    /**
     * @apiGroup USERS
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login to login user.
     *
     * @apiParam {string} email  email of the user.(body params) (required)
     * @apiParam {string} password  password of the user.(body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Login Successful",
                "status": 200,
                "data": {
                        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlJTVHdnekQwZSIsImlhdCI6MTU0OTk2Nzg0MDk1NCwiZXhwIjoxNTUwMDU0MjQwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InZlcmlmaUNvZGUiOiIiLCJyb2xlIjoidXNlciIsInBob25lIjo5ODEyMTMxNDEyLCJjb3VudHlDb2RlIjoiOTEiLCJlbWFpbCI6Im51dGFuQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS29yZSIsImZpcnN0TmFtZSI6Ik51dGFuIiwidXNlcklkIjoiSEdZMmVNbE9hIn19.MePP2M-AQ-PZXcpe0FmOpncgL-JXj1ph6o9Ca7dKhZA",
                        "userDetails": {
                            "verifiCode": "",
                            "role": "user",
                            "phone": 9812131412,
                            "countyCode": "91",
                            "email": "nutan@gmail.com",
                            "lastName": "Kore",
                            "firstName": "Nutan",
                            "userId": "HGY2eMlOa"
                        }
                }
            }
    */

    //  params: userId.
    app.post(`${baseUrl}/logout`, userController.logout);
    
    /**
     * @apiGroup USERS
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId  userId of the user.(body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "Logged Out Successfully",
                    "status": 200,
                    "data": null
                }
    */

        // params: email.
        app.post(`${baseUrl}/sendVeriCode`, userController.sendVeriCode);

        /**
         * @apiGroup USERS
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/sendVeriCode to send verification code to user
         *
         * @apiParam {string} email  email of the user.(body params) (required)
    
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                    {
                        "error": false,
                        "message": "Mail Send Successful",
                        "status": 200,
                        "data": null
                    }
        */
    
        // params: email.
        app.post(`${baseUrl}/getCode`, userController.getCode);
    
        /**
         * @apiGroup USERS
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/getCode to get verification code to user
         *
         * @apiParam {string} email of the user.(body params) (required)
         *@apiParam {string} userId of the user.(body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "Verification Code Found",
                    "status": 200,
                    "data": {
                        "_id": "5c62a0ca29d86c21ea76bfd5",
                        "__v": 0,
                        "createdOn": "2019-02-12T10:32:42.000Z",
                        "verifiCode": "MS0p0l7kG",
                        "password": "$2a$10$aScrAsd9IOJv1bvgJfP6/.koaQFVpGt4PKGjR15vRVnhftpN4JugC",
                        "role": "user",
                        "phone": 9812131412,
                        "countyCode": "91",
                        "email": "nutan@gmail.com",
                        "lastName": "Kore",
                        "firstName": "Nutan",
                        "userId": "HGY2eMlOa"
                    }
                }
        */
           
            // params: email.
            app.post(`${baseUrl}/updatePass`, userController.updatePass);
    
            /**
             * @apiGroup USERS
             * @apiVersion  1.0.0
             * @api {post} /api/v1/users/updatePass to update password of the user
             *
             * @apiParam {string} email email of the user.(body params) (required)
             * @apiParam {string} newpassword new password of the user.(body params) (required)
             *
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:
                    {
                        "error": false,
                        "message": "Password Updated SuccessFully",
                        "status": 200,
                        "data": null
                    }
            */

    
    app.get(`${baseUrl}/members`, userController.getUserListFun);

       /**
        * @apiGroup USERS
        * @apiVersion  1.0.0
        * @api {get} /api/v1/users/members api for geting all users.
        *
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "Users Found",
                    "status": 200,
                    "data": [
                        {
                            "_id": "5c5ffd9c77d71a27660268e0",
                            "lastName": "Shelke",
                            "firstName": "Balaji",
                            "userId": "B_VOhRflU"
                        },
                        {
                            "_id": "5c61bdadd63e37a2865ef771",
                            "lastName": "LastName",
                            "firstName": "firstName",
                            "userId": "Wuc6LydE7"
                        },
                        {
                            "_id": "5c62a0ca29d86c21ea76bfd5",
                            "lastName": "Kore",
                            "firstName": "Nutan",
                            "userId": "HGY2eMlOa"
                        }
                    ]
                }
       */

}
