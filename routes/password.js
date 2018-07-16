const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const transporterConfig = require('../config/mailTransporter');
const mailHeader = require('../config/mailHeader');

// Send a mail to reset the password
router.post('/mail', (req, res, next) => {

  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.getUserByEmail(req.body.email, (err, user) => {
        if (!user) {
          return res.json({success: false, msg: 'No account with that email address exists'});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save( (err) => {
          done(err, token, user);
        });
      });
    },
    (token, user, done) => {

      let transporter = nodemailer.createTransport(transporterConfig);

      let mailOptions = mailHeader('server@meanauthbase.com', user.email, '[MeanAuthBase] Password');
      mailOptions.html = `
                          <p>Dear ${user.username},</p>
                          <p>Please click on the link below to reset your password:</p>
                          <a href="http://${req.headers.host}/reset/${token}">Reset my password</a>
                          <p>If you did not ask to reset your password, please ignore this mail.</p>
                          <p>
                            See you soon,<br>
                            MeanAuthBase
                          </p>
                        `;

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.json({success: false, msg: 'Message not sent'});
          }
          console.log(`Message sent to ${user.email}: ${info.messageId}`);
          return res.json({success: true, msg: 'Message sent: Please check your mailbox'});
      });
    }], (err) => {
    if (err) return next(err);
  });
});

// Update the password and send a mail when the password is updated
router.post('/reset/:token', (req, res) => {

  async.waterfall([
    (done) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          console.log('User not found');
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if(err) throw err;
              user.password = hash;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save((err) =>{
                  done(err, user);
              });
            });
          });
        }
      });
    },
    (user, done) => {

      let transporter = nodemailer.createTransport(transporterConfig);

      let mailOptions = mailHeader('server@meanauthbase.com', user.email, '[MeanAuthBase] Password updated');
      mailOptions.html = `
                          <p>Dear ${user.username},</p>
                          <p>Your password has successfully been changed.</p>
                          <p>
                            See you soon,<br>
                            MeanAuthBase
                          </p>
                        `;

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              return res.json({success: false, msg: 'Password not updated'});
          }
          console.log(`Message sent to ${user.email}: ${info.messageId}`);
          return res.json({success: true, msg: 'Password updated, you can log in', user: user});
      });
    }], (err) => {
      if (err) return next(err);
  });
});

module.exports = router;
