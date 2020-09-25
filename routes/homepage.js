const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //returns an html markup to the client in the home page using a view
  res.render("index", { title: "Genre App", message: "Sakib Adnan" });
});

module.exports = router;
