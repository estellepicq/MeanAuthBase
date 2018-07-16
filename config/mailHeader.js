module.exports = function(senderEmail, recipientEmail, subject) {
  let mailHeader = {
                    from: senderEmail,
                    to: recipientEmail,
                    subject: subject
                   };
  return mailHeader;
}
