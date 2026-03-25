const axios = require("axios");

const checkWebsite = async (url) => {
  const start = Date.now();

  try {
    const res = await axios.get(url, { timeout: 5000 });

    return {
      status: "UP",
      responseTime: Date.now() - start
    };
  } catch (err) {
    return {
      status: "DOWN",
      responseTime: null
    };
  }
};

module.exports = checkWebsite;