const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();

Fawn.init(mongoose);

//**********GET Requests*********

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

//**********POST Requests*********
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //checking if the customerID, movieId is a valid objectId
  // if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
  //   return res.status(400).send("Invalid customerId of customer.");

  // if (!mongoose.Types.ObjectId.isValid(req.body.movieId))
  //   return res.status(400).send("Invalid movieId of movie.");

  //check if the customer by its Id. if we dont have the Id we return error
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid customer");
  }

  //find the movie sent by the customer by the movieId
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invalid movie");
  }

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not available at the moment");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

//   rental = await rental.save();

//   movie.numberInStock--;
//   movie.save();

module.exports = router;
