const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Student = require("../models/Student.model");

//  GET  /students
router.get("/students", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    console.log("Retrieved students ->", students);
    res.json(students);
  } catch (error) {
    next(error);
    res.status(500).send({ error: "Failed to retrieve students" });
  }
});

router.get("/students/:studentId", async (req, res, next) => {
  const studentId = req.params.studentId;

  try {
    const student = await Student.findById(studentId).populate("cohort");

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
});

router.get("/students/cohort/:cohortId", async (req, res, next) => {
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
router.post("/students", isAuthenticated, async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

//PUT - /student
router.put(
  "/students/:studentId",
  isAuthenticated,
  async (request, response) => {
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
  }
);
//  DELETE  /students/:studentId route
router.delete(
  "/students/:studentId",
  isAuthenticated,
  async (request, response) => {
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
  }
);

module.exports = router;
