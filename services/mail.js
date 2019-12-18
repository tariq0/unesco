const nodemailer = require("nodemailer");
const config = require("config");

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport(config.get('mail.options'));
  // 2) Define the email options
  const mailOptions = {
    from: "EGNATCOM <unescobackend@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
