const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const time = require('./timeLib');
const appConfig = require('../../config/appConfig');
const EmailModel = mongoose.model('email_log');


let emailSend=(config)=>{
    //console.log("config=====>",config);
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "vivektesting07@gmail.com", // generated ethereal user
            pass: "8080366488" // generated ethereal password
        }});
    
        let mailOptions = {
            from: '"Meeting Planer" <vivektesting07@gmail.com>', // sender address
            to: config.to, // list of receivers
            subject: config.subject, // Subject line
            text: config.text, // plain text body
            html: config.html // html body
        };
        
        let newEmail = new EmailModel({
            email:config.to,
            subject:config.subject,
            body:config.html,
            sent_stamp: time.now()
        });

        newEmail.save((err, newEmail) => {
            if (err) {
              logger.error(err.message, 'emailLib: send', 50)
              let apiResponse = response.generate(true, 'Failed to send Email', 500, null)
              //reject(apiResponse)
            } else {
    
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('email err');
                    return console.log(error);
                }else{
                    console.log('Message sent: %s', info);
                }
            });
            //let newEmailObj = newEmail.toObject();
              //resolve(newEmailObj);
            }
          });
      
}
module.exports={
    emailSend:emailSend
}
