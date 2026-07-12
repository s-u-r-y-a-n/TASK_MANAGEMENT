import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;
const port = Number(process.env.SMTP_PORT);
// const secure = port === 465;
// const rejectUnauthorized = process.env.SMTP_REJECT_UNAUTHORIZED !== "false";

const auth = {
  user: user,
  pass: password,
};

const transporter = nodemailer.createTransport({
  host,
  port,
  auth,
  tls: {
    rejectUnauthorized: false
  },
});

export default transporter;
