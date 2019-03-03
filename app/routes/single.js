const express = require('express');
const router = express.Router();
const singleController = require("./../../app/controllers/singleController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/single`;

    app.post(`${baseUrl}/addlist`, singleController.addlist);

    app.get(`${baseUrl}/getAllList`, singleController.getAllList);

    app.post(`${baseUrl}/deleteList`, singleController.deleteList);

    app.post(`${baseUrl}/updateList`, singleController.updateList);
}