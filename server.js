const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const app = express();

app.use(express.json());
dotenv.config({ path: "./config/config.env" });

if (process.env === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 500;
app.listen(port, () =>
  console.log(`${process.env.NODE_ENV} Server running on port ${port}...`)
);
