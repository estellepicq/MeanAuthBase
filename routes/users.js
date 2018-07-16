const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporterConfig = require('../config/mailTransporter');
const mailHeader = require('../config/mailHeader');

//Check mail route
router.get('/newmail/:email', (req, res) => {
  User.getUserByEmail(req.params.email, (err, user) => {
    if(user && user.active) {
      res.json({success: false, msg: 'Email already registered'});
    } else {
      res.json({success: true, msg: 'New email address'});
    }
  });
});

//Register route
router.post('/register', (req, res, next) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd = '0'+dd
  }
  if(mm<10) {
      mm = '0'+mm
  }
  today = dd + '/' + mm + '/' + yyyy;

  let newUser = new User({
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    birthday: req.body.birthday,
    gender: req.body.gender,
    registrationDate: today,
    active: false
  });

  User.getUserByEmail(newUser.email, (err, user) => {
    if(err) throw err;
    //If user already existing and active = true
    if(user && user.active) {
      //Return an error message
      res.json({success: false, msg: 'Email already registered'});
      //If user already existing and active = false
    } else if (user && !user.active) {
      //Send a new confirmation mail without creating the user
      let transporter = nodemailer.createTransport(transporterConfig);

      let mailOptions = mailHeader('server@meanauthbase.com', user.email, '[MeanAuthBase] Confirm your registration')
      mailOptions.html = `
                          <p>Dear ${user.username},</p>
                          <p>Please click on the link below to confirm your registration:</p>
                          <a href="http://${req.headers.host}/confirm/${user.registrationToken}">Confirm your registration</a>
                          <p>If you did not want to register on MeanAuthBase, please ignore this mail.</p>
                          <p>
                            See you soon,<br>
                            MeanAuthBase
                          </p>
                        `;

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.json({success: false, msg: 'Something went wrong, please try again'});
          } else {
            console.log(`Message sent to ${user.email}: ${info.messageId}`);
            return res.json({success: true, msg: 'Email already registered: Please check your mailbox to confirm your registration'});
          }
      });
      //If user not existing
    } else {
      //Create the user with active = false and send a mail to the user so he can confirm
      async.waterfall([
        (done) => {
          crypto.randomBytes(20, (err, buf) => {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        (token, done) => {
          User.addUser(newUser, (err, user) => {
            if(err){
              res.json({success: false, msg:'Something went wrong, please try again'});
            } else {
              user.registrationToken = token;
              user.save( (err) => {
                done(err, token, user);
              });
            }
          });
        },
        (token, user, done) => {
          let transporter = nodemailer.createTransport(transporterConfig);

          let mailOptions = mailHeader('server@meanauthbase.com', user.email, '[MeanAuthBase] Confirm your registration');
          mailOptions.html = `
                              <p>Dear ${user.username},</p>
                              <p>Please click on the link below to confirm your registration:</p>
                              <a href="http://${req.headers.host}/confirm/${token}">Confirm your registration</a>
                              <p>If you did not want to register on MeanAuthBase, please ignore this mail.</p>
                              <p>
                                See you soon,<br>
                                MeanAuthBase
                              </p>
                            `;

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                return res.json({success: false, msg: 'Something went wrong, please try again'});
              } else {
                console.log(`Message sent to ${user.email}: ${info.messageId}`);
                return res.json({success: true, msg: 'Message sent: Please check your mailbox to confirm your registration'});
              }
          });
        }], (err) => {
        if (err) return next(err);
      });
    }
  });
});

//Confirm registration route
router.put('/register/confirm/:token', (req, res, next) => {

  async.waterfall([
    (done) => {
      User.findOne({ registrationToken: req.params.token }, (err, user) => {
        if (!user) {
          res.json({success: false, msg: 'Wrong URL or registration already confirmed'});
        } else {
          user.registrationToken = undefined;
          user.active = true;
          user.save((err) => {
              done(err, user);
          });
        }
      });
    },
    (user, done) => {

      let transporter = nodemailer.createTransport(transporterConfig);

      let mailOptions = mailHeader('server@meanauthbase.com', user.email, '[MeanAuthBase] Your are now registered');
      mailOptions.html = `
                          <p>Dear ${user.username},</p>
                          <p>You have successfully confirmed your registration.</p>
                          <p>
                            See you soon,<br>
                            MeanAuthBase
                          </p>
                        `;

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              return res.json({success: false, msg: error});
          }
          console.log(`Message sent to ${user.email}: ${info.messageId}`);
          return res.json({success: true, msg: 'Registration confirmed: you are now logged in', user: user});
      });
    }], (err) => {
      if (err) return next(err);
  });
});

//Authenticate route
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw error;
    if(!user) {
      return res.json({success: false, msg: 'Unknown email address'});
    } else if (user && !user.active) {
      return res.json({success: false, msg: 'Registration not confirmed. Please confirm your registration first'});
    } else {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw error;
        if(isMatch || password === user.password) {
          const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 //1 week
          });

          res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        } else {
          return res.json({success: false, msg: 'Wrong password'});
        }
      });
    }
  });
});

//Profile (protected by second parameter)
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

// Update Profile
router.put('/edit/:id', (req, res, next) => {
  let id = req.params.id;
  User.getUserById(id, (err, user) => {
    user.birthday = req.body.birthday;
    user.gender = req.body.gender;
    User.addUser(user, (err, userUpdated) => {
      if(err){
        res.json({success: false, msg:'Something went wrong, please try again'});
      } else {
        res.json({success: true, msg:'Profile updated'});
      }
    });
  });
});

module.exports = router;
