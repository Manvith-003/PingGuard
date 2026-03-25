const Website = require("../models/website.model");
const sendEmail = require("../services/email.service");

const generateReport = async () => {
  const sites = await Website.find();

  let report = "Daily Uptime Report\n\n";

  sites.forEach(site => {
    const total = site.uptimeCount + site.downtimeCount;
    const uptime = total ? ((site.uptimeCount / total) * 100).toFixed(2) : 0;

    report += `${site.name}
URL: ${site.url}
Uptime: ${uptime}%
----------------------\n`;
  });

  await sendEmail("Daily Report", report);
};

module.exports = generateReport;