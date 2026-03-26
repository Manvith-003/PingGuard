const axios = require("axios");

const checkWebsite = async (url) => {
  const start = Date.now();

  try {
    // 🔹 Use HEAD request (lightweight ping)
    const res = await axios.head(url, {
      timeout: 5000,
      validateStatus: () => true // accept all status codes
    });

    const responseTime = Date.now() - start;

    // 🔹 Check status code
    if (res.status >= 200 && res.status < 400) {
      return {
        status: "UP",
        responseTime
      };
    } else {
      return {
        status: "DOWN",
        responseTime
      };
    }

  } catch (err) {
    // 🔁 Retry once if failed
    try {
      const res = await axios.head(url, { timeout: 5000 });

      return {
        status: "UP",
        responseTime: Date.now() - start
      };
    } catch {
      return {
        status: "DOWN",
        responseTime: null
      };
    }
  }
};

module.exports = checkWebsite;  