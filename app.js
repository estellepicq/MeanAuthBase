const app = require('express')();
const server = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const express = require('express');

//Connect to database
mongoose.connect(config.database);

// On connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

// On error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});

const users = require('./routes/users');
const password = require('./routes/password');
const contact = require('./routes/contact');

//Port Number
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors());

// Set static folders
app.use('/', express.static(__dirname + '/public/app'));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Load APIs
app.use('/users', users);
app.use('/password', password);
app.use('/contact', contact);

// Load angular app in French
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/app/index.html'));
});

// Start server
server.listen(port, () => {
  console.log('Server started on port ' + port);
});
