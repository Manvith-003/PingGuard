let CHECK_INTERVAL = 10; // default 10 minutes

const setIntervalValue = (value) => {
  const newInt = parseInt(value);
  if (isNaN(newInt)) {
    console.error(`❌ Attempted to set invalid interval: ${value}`);
    return;
  }
  console.log(`⏱ Monitoring timer set to: ${newInt} minutes`);
  CHECK_INTERVAL = newInt;
};

const getIntervalValue = () => CHECK_INTERVAL;

module.exports = {
  setIntervalValue,
  getIntervalValue
};