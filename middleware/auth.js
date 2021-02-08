const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { errorResponse } = require("../utils/response");


const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send(errorResponse(Error("Access denied. No token provided.")));
  try {
    const decoded = jwt.verify(token, process.env.API_KEY);
    req.user = decoded;
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(400)
        .send(errorResponse(Error("Request failed Invalid Token")));
  } catch (ex) {
    res.status(400).send(errorResponse(Error("Invalid Token")));
  }
  next();
};

module.exports = auth;
