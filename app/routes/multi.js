const express = require('express');
const router = express.Router();
const multiController = require("./../../app/controllers/multiController");
const appConfig = require("./../../config/appConfig");
const auth = require("./../middlewares/auth");

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/multi`;

    app.get(`${baseUrl}/frdReq`,auth.isAuthorized, multiController.frdReq);

    // app.get(`${baseUrl}/frdList`,auth.isAuthorized, multiController.frdReq);

    app.post(`${baseUrl}/sendReq`,auth.isAuthorized,multiController.sendReq);

    app.post(`${baseUrl}/cancelReq`,auth.isAuthorized,multiController.cancelReq);

    app.post(`${baseUrl}/mgetAllList`,auth.isAuthorized ,multiController.mgetAllList);

    app.get(`${baseUrl}/undo`,multiController.undo);

    app.post(`${baseUrl}/acceptReq`,auth.isAuthorized ,multiController.acceptReq);

    app.post(`${baseUrl}/unfriend`,auth.isAuthorized ,multiController.unfriend);

}