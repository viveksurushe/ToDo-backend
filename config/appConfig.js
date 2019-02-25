let appConfig = {};

appConfig.port = 4000;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri: 'mongodb://127.0.0.1:27017/todo'
  }
appConfig.apiVersion = '/api/v1';
appConfig.email={
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "vivektesting07@gmail.com", // generated ethereal user
        pass: "8080366488" // generated ethereal password
    }
}


module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db :appConfig.db,
    apiVersion : appConfig.apiVersion,
    email:appConfig.email
};