const transporterConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'your.user@gmail.com',
      pass: 'your.password'
  }
}

module.exports = transporterConfig;
