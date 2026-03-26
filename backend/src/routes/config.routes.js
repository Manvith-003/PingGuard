const express = require("express");
const router = express.Router();

const { setIntervalValue } = require("../config/interval.config");

router.post("/set-interval", (req, res) => {
  const { interval } = req.body;

  setIntervalValue(interval);

  res.json({
    message: "Interval updated",
    interval
  });
});

module.exports = router;
