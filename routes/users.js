const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//auth here is authorization, not authentication. We want to see if a user has permission to use a resource or not.
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//**********POST Requests*********
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //check if user is already registered in the database. If so return error
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  // });

  //same as above but using lodash
  user = new User(lodash.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10); //asynchronous version of genSalt. Pass the number of rounds passed as argument the algorithm runs to generate the salt
  user.password = await bcrypt.hash(user.password, salt); //hash the password using the salt generated
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
