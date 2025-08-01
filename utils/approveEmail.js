const nodemailer = require('nodemailer');

const approveEmail = async (to, subject, text = '', html = '') => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to, 
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to User");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = approveEmail;
