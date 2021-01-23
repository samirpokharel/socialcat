const { func } = require("joi");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((val) => console.log("Connected to DB."))
    .catch((err) => {
      console.log("Could not connect to DB...", err);
      process.exit();
    });
};
