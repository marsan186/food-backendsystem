const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

exports.sendMailtoUser = function (req, res, next) {

    var smtpTransport = require('nodemailer-smtp-transport');

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'fsefood2019@gmail.com',
            pass: 'fsAdmin@123'
        }
    }));

    var mailOptions = {
        from: 'fsefood2019@gmail.com',
        to: req.restarunt_email,
        subject: 'Vendor Registered Successfully',
        text: 'Vendor register successfully. You will get confirmation shortly!!!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


