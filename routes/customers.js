const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

//**********GET Requests*********

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customers = await Customer.findById(req.params.id);
  if (!customers) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist.");
  }

  res.send(customers);
});
//**********POST Requests*********
router.post("/", async (req, res) => {
  //   const { error } = validateCustomer(req.body);
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.send(customer);
});
//**********PUT Requests*************/
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );

  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  res.send(customer);
});

//**********DELETE Requests */
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  res.send(customer);
});

module.exports = router;
