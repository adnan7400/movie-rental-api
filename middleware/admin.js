//checking if the current user an admin or not

//this function will be executed after our authorization middleware function in auth.js in this folder

//401 Unauthorized
//403 Forbidden

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
};
