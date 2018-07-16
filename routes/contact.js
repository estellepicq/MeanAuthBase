const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const transporterConfig = require('../config/mailTransporter');
const mailHeader = require('../config/mailHeader');

router.post('/mail', (req, res, next) => {

  let subject = req.body.subject;
  let message = req.body.message;
  let email = req.body.email;

  let transporter = nodemailer.createTransport(transporterConfig);

  let mailOptions = mailHeader(email, 'your.user@gmail.com', '[MeanAuthBase] Contact request');
  mailOptions.html = `
                      <h3>Subject: ${subject}</h3>
                      <p>Message:</p>
                      <p>${message}</p>
                      <p>Sent by: ${email}</p>
                    `;

  let confirmationMailOptions = mailHeader('your.user@gmail.com', email, '[MeanAuthBase] Confirmation for your contact request');
  confirmationMailOptions.html = `
                                  <p>
                                    Hello,<br>
                                    The message below has been sent to our team:
                                  </p>
                                  <hr>
                                  <h3>Subject: ${subject}</h3>
                                  <p>Message:</p>
                                  <p>${message}</p>
                                  <hr>
                                  <p>
                                    See you soon,<br>
                                    MeanAuthBase
                                  </p>
                                `;

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({success: false, msg: 'Something went wrong, please try again'});
      } else {
        transporter.sendMail(confirmationMailOptions, (error, info) => {
          if (error) {
            return res.json({success: false, msg: 'Something went wrong, please try again'});
          } else {
            return res.json({success: true, msg: 'Message sent'});
          }
        });
      }
  });

});

module.exports = router;
