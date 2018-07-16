# MeanAuthBase

## Description

Base for Angular projects running with a Node.js back-end.

## Local setup

Clone the project in a local directory: `git clone https://github.com/estellepicq/MeanAuthBase.git`
1. Angular project setup
* Once you are in your local directory, go in Angular source folder: `cd front-src`
* Run `npm install`

2. Node.js project setup
* Run `npm install` at the root of your local directory

## Mail configuration

* Replace the transporterConfig with your gmail /smtp server information in `./config/mailTransporter.js`
* Configure the mail options in the files of `./routes` folder

## Usage

**Development**
* In local directorty, run `node app.js`. It will launch server on port 3000.
* Go to front-src directory: `cd front-src`
* Run `ng serve`
* Navigate to `http://localhost:4200/`

**Production**
* Go to front-src directory: `cd front-src`
* Run `ng build --prod`
* Run `node app.js` in the root folder
* Navigate to `http://localhost:3000/`
