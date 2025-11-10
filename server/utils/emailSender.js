import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();


sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

console.log("sendgrid api key ",process.env.SEND_GRID_API_KEY ? "is set----------":"is not set----------");


export const sendEmail = async ({ email, subject, message }) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject,
    html: message,
  };



  await sgMail.send(msg);
};