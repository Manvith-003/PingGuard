const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendEmailWithPDF = async (emails, filePath) => {
  if (!process.env.EMAIL || !process.env.PASSWORD) {
    throw new Error("SMTP credentials missing. Please set EMAIL and PASSWORD in your .env file.");
  }

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: emails.join(","),
    subject: "Website Monitoring Report",
    text: "Please find attached report.",
    attachments: [
      {
        filename: "report.pdf",
        path: filePath
      }
    ]
  });
};

module.exports = sendEmailWithPDF;