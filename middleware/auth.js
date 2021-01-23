const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(toekn, process.env.API_KEY);
    req.user = decoded;
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = auth;
