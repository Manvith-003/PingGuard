const axios = require("axios");

const checkWebsite = async (url) => {
  const start = Date.now();

  try {
    // ✅ Try GET first (most reliable)
    const res = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true
    });

    const responseTime = Date.now() - start;

    if (res.status >= 200 && res.status < 500) {
      return { status: "UP", responseTime };
    } else {
      return { status: "DOWN", responseTime };
    }

  } catch (err) {
    // 🔁 Fallback to HEAD (if GET fails)
    try {
      const res = await axios.head(url, {
        timeout: 5000,
        validateStatus: () => true
      });

      const responseTime = Date.now() - start;

      if (res.status >= 200 && res.status < 500) {
        return { status: "UP", responseTime };
      } else {
        return { status: "DOWN", responseTime };
      }

    } catch {
      return { status: "DOWN", responseTime: null };
    }
  }
};

module.exports = checkWebsite;