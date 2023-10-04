const nodemailer = require("nodemailer");

const sendEmailViaGmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_FROM_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
    console.log("email sent successfully");
  } catch (error) {
    console.log("error while sending email", error);
  }
};

module.exports = sendEmailViaGmail;
