const express = require("express");
const router = express.Router();

const Cohort = require("../models/Cohort.model");

//  GET - /cohorts
router.get("/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();

    res.status(200).json(cohorts);
  } catch (error) {
    next(error);
  }
});
router.get("/cohorts/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;

  try {
    const cohort = await Cohort.findById(cohortId);

    res.status(200).json(cohort);
  } catch (error) {
    next(error);
  }
});

// POST - /cohorts
router.post("/cohorts", async (req, res, next) => {
  try {
    const newCohort = await Cohort.create(req.body);

    res.status(201).json(newCohort);
  } catch (error) {
    next(error);
  }
});

// PUT - /cohorts
router.put("/cohorts/:cohortId", async (request, response) => {
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
router.delete(
  "/cohorts/:cohortId",
  async (request, response) => {
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
  }
);

module.exports = router;
