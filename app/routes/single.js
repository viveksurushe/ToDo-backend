const express = require('express');
const router = express.Router();
const singleController = require("./../../app/controllers/singleController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/single`;

    app.post(`${baseUrl}/addlist`, singleController.addlist);

    app.post(`${baseUrl}/getAllList`, singleController.getAllList);

    app.post(`${baseUrl}/deleteList`, singleController.deleteList);

    app.post(`${baseUrl}/updateList`, singleController.updateList);

    app.post(`${baseUrl}/getTodo`, singleController.getTodo);

    app.post(`${baseUrl}/addTodo`, singleController.addTodo);

    app.post(`${baseUrl}/deleteTodo`, singleController.deleteTodo);

    app.post(`${baseUrl}/updateTodo`, singleController.updateTodo);

    app.post(`${baseUrl}/done`, singleController.done);

    app.post(`${baseUrl}/childAdd`, singleController.childAdd);

    app.post(`${baseUrl}/childdelete`, singleController.childdelete);

    app.post(`${baseUrl}/childupdate`, singleController.updateChild);
    
}