const express = require('express');
const router = express.Router();
const multiController = require("./../../app/controllers/multiController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/multi`;

    app.get(`${baseUrl}/frdReq`, multiController.frdReq);

    app.get(`${baseUrl}/frdList`, multiController.frdReq);

    app.post(`${baseUrl}/sendReq`,multiController.sendReq);
}