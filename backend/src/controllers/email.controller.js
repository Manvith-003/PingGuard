const EmailConfig = require("../models/emailConfig.model");

const intervalMap = {
    "1m": 1,
    "1h": 60,
    "6h": 360,
    "12h": 720,
    "1d": 1440,
    "7d": 10080,
    "1M": 43200
};

// Get current email config
exports.getEmailConfig = async (req, res, next) => {
    try {
        const config = await EmailConfig.findOne();
        if (!config) return res.json({ emails: [], interval: 60 });

        // Convert minutes back to intervalKey
        const intervalKey = Object.keys(intervalMap).find(key => intervalMap[key] === config.interval) || "1h";

        res.json({ emails: config.emails, intervalKey });
    } catch (err) {
        next(err);
    }
};

// Save or update email config
exports.setEmailConfig = async (req, res, next) => {
    try {
        const { emails, intervalKey } = req.body;
        const interval = intervalMap[intervalKey];

        let config = await EmailConfig.findOne();

        if (!config) {
            config = await EmailConfig.create({ emails, interval });
        } else {
            config.emails = emails;
            config.interval = interval;
            await config.save();
        }

        res.json({ message: "Email configuration saved successfully" });
    } catch (err) {
        next(err);
    }
};
