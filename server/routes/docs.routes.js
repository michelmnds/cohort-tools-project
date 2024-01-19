const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "docs.html");
  res.sendFile(filePath);
});

module.exports = router;
