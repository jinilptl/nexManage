// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();

// sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
// console.log("SENDGRID KEY:", process.env.SEND_GRID_API_KEY);
// console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

// // console.log("sendgrid api key ",process.env.SEND_GRID_API_KEY ? "is set----------":"is not set----------");

// export const sendEmail = async ({ email, subject, message }) => {
//   const msg = {
//     to: email,
//     from: process.env.EMAIL_FROM,
//     subject,
//     html: message,
//   };

//   await sgMail.send(msg);
// };

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false, 
//   auth: {
//     user: process.env.SMTP_USER, 
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendEmail = async ({ email, subject, message }) => {
//   return transporter.sendMail({
//     to: email,
//     from: process.env.MAIL_FROM_EMAIL,
//     subject,
//     html: message,
//   });
// };


import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

// Brevo client init
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ email, subject, message }) => {
  await tranEmailApi.sendTransacEmail({
    sender: {
      name: process.env.MAIL_FROM_NAME,
      email: process.env.MAIL_FROM_EMAIL,
    },
    to: [{ email }],
    subject,
    htmlContent: message,
  });
};
