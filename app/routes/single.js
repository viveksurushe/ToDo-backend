const express = require('express');
const router = express.Router();
const singleController = require("./../../app/controllers/singleController");
const appConfig = require("./../../config/appConfig");
const auth =require("./../middlewares/auth");

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/single`;

    app.post(`${baseUrl}/addlist`,auth.isAuthorized,singleController.addlist);

    app.post(`${baseUrl}/getAllList`,auth.isAuthorized, singleController.getAllList);

    app.post(`${baseUrl}/deleteList`,auth.isAuthorized, singleController.deleteList);

    app.post(`${baseUrl}/updateList`,auth.isAuthorized, singleController.updateList);

    app.post(`${baseUrl}/getTodo`,auth.isAuthorized, singleController.getTodo);

    app.post(`${baseUrl}/addTodo`, auth.isAuthorized, singleController.addTodo);

    app.post(`${baseUrl}/deleteTodo`,auth.isAuthorized, singleController.deleteTodo);

    app.post(`${baseUrl}/updateTodo`, auth.isAuthorized,singleController.updateTodo);

    app.post(`${baseUrl}/done`,auth.isAuthorized, singleController.done);

    app.post(`${baseUrl}/childAdd`, auth.isAuthorized,singleController.childAdd);

    app.post(`${baseUrl}/childdelete`, singleController.childdelete);

    app.post(`${baseUrl}/childupdate`, singleController.updateChild);
    
}