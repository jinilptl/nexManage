import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chintandesai249@gmail.com",
        pass: "awyp zgyw ylhm pcmm",
      },
    });

    await transporter.sendMail({
      from: `"NexManage" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
    });

  } catch (error) {
    throw error;
  }
};

export default sendEmail;
