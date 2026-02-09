const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SMTP2GO_API_KEY,
  },
});

const sendInviteEmail = async ({ name, email, password }) => {
  return transporter.sendMail({
    from: '"Nexforge Team" <noreply@nexforge.tech>',
    to: email,
    subject: "You are invited to Nexforge 🚀",
    html: `
      <h2>Hello ${name},</h2>
      <p>You have been invited to join Nexforge.</p>

      <p><b>Login credentials:</b></p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>

      <p>Please change your password immediately after login.</p>
      <br/>
      <p>— Nexforge Team</p>
    `,
  });
};

module.exports = { sendInviteEmail };
