// const startupDebugger = require("debug")("app:startup");
// const morgan = require("morgan");
// const helmet = require("helmet");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const auth = require("./routes/auth");
const users = require("./routes/users");
const homepage = require("./routes/homepage");
const mongoose = require("mongoose");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./views");

// console.log(`NODE_ENG: ${process.env.NODE_ENV}`);
// //Configuration
// console.log(`Application Name: ${config.get("name")}`);
// console.log(`Mail Server: ${config.get("mail.host")}`);
// console.log(`Mail Password: ${config.get("mail.password")}`);

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   startupDebugger("Morgan enabled...");
// }

mongoose
  .connect("mongodb://localhost/chelseay", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// app.use(helmet());

app.use("/", homepage);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
