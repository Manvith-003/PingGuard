const Website = require("../models/website.model");
const EmailConfig = require("../models/emailConfig.model");
const generatePDF = require("./pdf.service");
const sendEmailWithPDF = require("./email.service");
const fs = require("fs");

const sendScheduledReport = async () => {
    const config = await EmailConfig.findOne();
    if (!config) return;

    const now = new Date();
    const lastSent = config.lastSentAt || new Date(0);

    const diffMinutes = (now - lastSent) / (1000 * 60);
    const interval = config.interval || 60; // Default to 1 hour if not set

    if (diffMinutes < interval) {
        return;
    }

    // 🔒 Update timestamp BEFORE sending to prevent race conditions from overlapping cron runs
    config.lastSentAt = now;
    await config.save();

    if (!config.emails || config.emails.length === 0) {
        console.log("Skipping report: no recipient emails configured");
        return;
    }

    const sites = await Website.find();
    if (sites.length === 0) {
        console.log("Skipping report: no websites monitored");
        return;
    }

    try {
        const filePath = await generatePDF(sites);
        await sendEmailWithPDF(config.emails, filePath);
        fs.unlinkSync(filePath); // cleanup
        console.log("Report sent successfully");
    } catch (err) {
        console.error("Failed to send scheduled report:", err.message);
    }
};

module.exports = sendScheduledReport;