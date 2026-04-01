const Website = require("../models/website.model");
const { sendEmail } = require("../services/email.service");

const generateReport = async () => {
  const sites = await Website.find();
  const config = await require("../models/emailConfig.model").findOne();
  const recipients = config?.emails?.length ? config.emails : [process.env.EMAIL];

  let reportHtml = "<h2>Daily Uptime Report</h2><ul>";

  sites.forEach(site => {
    const total = site.uptimeCount + site.downtimeCount;
    const uptime = total ? ((site.uptimeCount / total) * 100).toFixed(2) : 0;

    reportHtml += `<li><strong>${site.name}</strong><br>
URL: ${site.url}<br>
Uptime: ${uptime}%</li><br>`;
  });

  reportHtml += "</ul>";

  if (recipients[0]) {
    await sendEmail(recipients, "Daily Service Report", reportHtml);
  }
};

module.exports = generateReport;