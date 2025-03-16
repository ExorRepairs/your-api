const express = require("express");
const { getAllJobs, getJobById } = require("../controllers/jobsController");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);

module.exports = router;
