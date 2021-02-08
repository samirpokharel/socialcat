const { User, validateUser } = require("../models/User");
const { userResponse, errorResponse } = require("../utils/response");
const asyncMiddleware = require("../middleware/async");

const joi = require("joi");

module.exports.login = asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(401).send(errorResponse(error));
  const { email, password } = req.body;
  const user = await User.login(email, password);
  const token = await user.generateJWT(user);
  res.send(userResponse(user, token));
});

module.exports.register = asyncMiddleware(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(401).send(errorResponse(error));
  const { email, password } = req.body;
  const user = await User.create({ email, password });
  const token = await user.generateJWT(user);
  res.send(userResponse(user, token));
});

function validate(body) {
  const schema = joi.object({
    email: joi.string().required().min(5).max(255).email(),
    password: joi.string().required().min(6).max(200),
  });
  return schema.validate(body);
}
