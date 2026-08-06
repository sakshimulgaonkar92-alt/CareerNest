const express = require("express");
const router = express.Router();
const { searchJobs } = require("../controllers/searchController");

router.get("/", searchJobs); // public

module.exports = router;
