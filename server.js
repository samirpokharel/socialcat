const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth_route");
const postRoute = require("./routes/post_route");
const mongodbConnection = require("./utils/db");
const handelError = require("./middleware/handelError");

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config({ path: "./config/config.env" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//mongodb Database connection
mongodbConnection();
//routes
app.use("/api/v1/users", authRoute);
app.use("/api/v1/posts", postRoute);

app.use(handelError);

const port = process.env.PORT || 500;
app.listen(port, () =>
  console.log(`${process.env.NODE_ENV} Server running on port ${port}...`)
);
