require("dotenv").config();
const cron = require("node-cron");
const app = require("./app");
const connectDB = require("./config/db");
const { runMonitor } = require("./services/monitor.service");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

cron.schedule("* * * * *", async () => {
  try {
    await runMonitor();
  } catch (err) {
    console.error("❌ Error in cron job:", err.message);
  }
});