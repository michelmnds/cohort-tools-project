const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorHandler, notFoundHandler } = require("./middleware/error-handling");

const mongoose = require("mongoose");

const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

const PORT = 5005;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const middlewares = []


app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());


app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//  GET  /students
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    console.log("Retrieved students ->", students);
    res.json(students);
  } catch (error) {
    next(error);
    res.status(500).send({ error: "Failed to retrieve students" });
  }
});
app.get("/api/students/:studentId", async (req, res, next) => {
  const studentId = req.params.studentId;

  try {
    const student = await Student.findById(studentId).populate("cohort");

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
});
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;

  try {
    const studentList = await Student.find({ cohort: cohortId }).populate(
      "cohort"
    );

    res.status(200).json(studentList);
  } catch (error) {
    next(error);
  }
});

//POST - /students
app.post("/api/students", async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});
//PUT - /student
app.put("/api/students/:studentId", async (request, response) => {
  console.log(request.body);
  const payload = request.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      request.params.studentId,
      payload,
      { new: true }
    );
    response.status(200).json(updatedStudent);
  } catch (error) {
    next(error);
    response.status(500).json({ message: "Something bad happened" });
  }
});
//  DELETE  /api/students/:studentId route
app.delete("/api/students/:studentId", async (request, response) => {
  const { studentId } = request.params;
  try {
    const studentToDelete = await Student.findByIdAndDelete(studentId);
    response
      .status(204)
      .json({ message: `${studentToDelete.title} was remove from the db` });
  } catch (error) {
    next(error);
    response.status(500).json({ message: "Something bad happened" });
  }
});

//  GET - /cohorts
app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();

    res.status(200).json(cohorts);
  } catch (error) {
    next(error);
  }
});
app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;

  try {
    const cohort = await Cohort.findById(cohortId);

    res.status(200).json(cohort);
  } catch (error) {
    next(error);
  }
});

// POST - /cohorts
app.post("/api/cohorts", async (req, res, next) => {
  try {
    const newCohort = await Cohort.create(req.body);

    res.status(201).json(newCohort);
  } catch (error) {
    next(error);
  }
});

// PUT - /cohorts
app.put("/api/cohorts/:cohortId", async (request, response) => {
  console.log(request.body);
  const payload = request.body;
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      request.params.cohortId,
      payload,
      { new: true }
    );
    response.status(200).json(updatedCohort);
  } catch (error) {
    next(error);
    response.status(500).json({ message: "Something bad happened" });
  }
});
// Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId ", async (request, response) => {
  const { cohortId } = request.params;
  try {
    const cohortToDelete = await Cohort.findByIdAndDelete(cohortId);
    response
      .status(204)
      .json({ message: `${cohortToDelete.title} was remove from the db` });
  } catch (error) {
    next(error);
    response.status(500).json({ message: "Something bad happened" });
  }
});

app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
