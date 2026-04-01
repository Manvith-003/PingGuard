const { Resend } = require("resend");
const fs = require("fs");

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generic function to send an email via Resend
 * @param {string|string[]} emails - Recipient email addresses
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {string} [filePath] - Optional: path to an attachment file
 */
const sendEmail = async (emails, subject, html, filePath = null) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️  RESEND_API_KEY is missing. Skipping email send.");
      return;
    }

    // Prepare attachment if provided
    const attachments = [];
    if (filePath && fs.existsSync(filePath)) {
      const filename = filePath.split(/[/\\]/).pop();
      const content = fs.readFileSync(filePath);
      
      attachments.push({
        filename: filename || "attachment.pdf",
        content: content,
      });
    }

    const payload = {
      from: process.env.RESEND_FROM_EMAIL || "PingGuard <onboarding@resend.dev>",
      to: Array.isArray(emails) ? emails : [emails],
      subject,
      html,
      attachments
    };

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
};

/**
 * Compatibility function for existing reports
 * @param {string|string[]} emails - Recipient email addresses
 * @param {string} filePath - Path to the PDF report
 */
const sendEmailWithPDF = async (emails, filePath) => {
  return await sendEmail(
    emails,
    "Website Monitoring Report",
    `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #030712; padding: 24px; text-align: center;">
        <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">PingGuard</h1>
        <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Service Monitoring Report</p>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="font-size: 16px; margin-top: 0;">Hello,</p>
        <p style="line-height: 1.6;">Please find the attached monitoring report for your configured websites. This report provides a summary of uptime, response times, and current service status.</p>
        <p style="line-height: 1.6;">Stay secure and informed with <strong>PingGuard</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated notification from your PingGuard instance.</p>
      </div>
    </div>
    `,
    filePath
  );
};

// Export the main function and the PDF-specific one
module.exports = {
  sendEmail,
  sendEmailWithPDF
};