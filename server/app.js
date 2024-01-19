require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const mongoose = require("mongoose");

const app = express();
const Port = process.env.PORT;

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

// 👇 Start handling routes her
const allRoutes = require("./routes/index");
app.use(allRoutes);

const docsRouter = require("./routes/docs.routes");
app.use("/docs", docsRouter);

const studentRouter = require("./routes/student.routes");
app.use("/api", studentRouter);

const cohortRouter = require("./routes/cohort.routes");
app.use("/api", cohortRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(Port, () => {
  console.log(`Server listening on port ${Port}`);
});

module.exports = app;
