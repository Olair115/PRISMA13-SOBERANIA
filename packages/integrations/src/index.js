module.exports = {
  ...require("./auth/firebaseAuthClient"),
  ...require("./health/healthDataClient"),
  ...require("./wearables/appleHealthClient"),
  ...require("./wearables/googleFitClient"),
};
