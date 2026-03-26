const Website = require("../models/website.model");
const checkWebsite = require("./ping.service");
const { getIntervalValue } = require("../config/interval.config");

const runMonitor = async () => {
    const now = new Date();
    const sites = await Website.find();
    const globalDefaultInterval = getIntervalValue() || 10;

    const sitesToCheck = sites.filter(site => {
        const interval = site.checkInterval || globalDefaultInterval;
        if (!site.lastRunAt) return true;
        
        const diffMinutes = (now - site.lastRunAt) / (1000 * 60);
        // Add a 5-second buffer (5/60 mins) to ensure it triggers on time even with small delays
        return diffMinutes >= (interval - (5 / 60));
    });

    if (sitesToCheck.length === 0) {
        return;
    }

    console.log(`🚀 Monitoring ${sitesToCheck.length} sites...`);

    // Process websites in batches of 20 to prevent network overload
    const BATCH_SIZE = 20;
    for (let i = 0; i < sitesToCheck.length; i += BATCH_SIZE) {
        const batch = sitesToCheck.slice(i, i + BATCH_SIZE);

        await Promise.all(
            batch.map(async (site) => {
                try {
                    const result = await checkWebsite(site.url);

                    site.status = result.status;
                    site.responseTime = result.responseTime;
                    site.lastChecked = now;
                    site.lastRunAt = now;

                    if (result.status === "UP") site.uptimeCount++;
                    else site.downtimeCount++;

                    await site.save();
                } catch (err) {
                    console.error(`❌ Error checking ${site.url}:`, err.message);
                }
            })
        );

        if (sitesToCheck.length > BATCH_SIZE) {
            console.log(`📦 Processed batch ${Math.floor(i / BATCH_SIZE) + 1} (${Math.min(i + BATCH_SIZE, sitesToCheck.length)}/${sitesToCheck.length})`);
        }
    }

    console.log(`✅ Monitoring completed for ${sitesToCheck.length} sites`);
};

module.exports = {
    runMonitor
};
