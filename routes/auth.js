const { User } = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const config = require("config");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");

//**********POST Requests*********
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //validate email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  //generate a jwt
  const token = user.generateAuthToken();
  //route handler
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
