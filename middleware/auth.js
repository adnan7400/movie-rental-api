const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //verify if token is a valid jwt
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); //if verified, it will decode it and return a payload
    req.user = decoded; //the payload we get above, we put it into the request
    next();
  } catch (ex) {
    res.status(400).send("Invalid token sent.");
  }
}

module.exports = auth;
