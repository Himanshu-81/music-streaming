import nodemailer from "nodemailer";
import { ApiError } from "../utils/apiError.js";
import { registrationEmailTemplate } from "../../email/verifyEmailTemplate.js";

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendEmail = async (to, subject, name, verificationUrl) => {
  try {
    const mailOptions = {
      from: process.env.APP_MAIL,
      to,
      subject,
      html: registrationEmailTemplate(name, verificationUrl),
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, "Error sending email");
  }
};
