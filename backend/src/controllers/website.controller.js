const Website = require("../models/website.model");
const checkWebsite = require("../services/ping.service");

// Add
exports.createWebsite = async (req, res, next) => {
  try {
    const site = await Website.create(req.body);
    res.json(site);
  } catch (err) {
    next(err);
  }
};

// Get all
exports.getWebsites = async (req, res, next) => {
  try {
    const sites = await Website.find();
    res.json(sites);
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteWebsite = async (req, res, next) => {
  try {
    await Website.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

// 🔥 Ping Check
exports.pingWebsites = async (req, res, next) => {
  try {
    const sites = await Website.find();
    const now = new Date();

    await Promise.all(
      sites.map(async (site) => {
        const result = await checkWebsite(site.url);

        site.status = result.status;
        site.responseTime = result.responseTime;
        site.lastChecked = now;
        site.lastRunAt = now;

        if (result.status === "UP") site.uptimeCount++;
        else site.downtimeCount++;

        await site.save();
      })
    );

    res.json({ message: "All websites checked" });
  } catch (err) {
    next(err);
  }
};