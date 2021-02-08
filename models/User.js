const { Schema, model } = require("mongoose");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter emai"],
    loadClass: true,
    trim: true,
    minlength: 5,
    unique: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    maxlength: 1009,
  },
  fullName: {
    type: String,
    minlength: 3,
    maxlength: 300,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

UserSchema.methods.generateJWT = (user) => {
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.API_KEY);
  return token;
};

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw Error("Invalid Email");
  const comparepassword = await bcrypt.compare(password, user.password);
  if (!comparepassword) throw Error("Invalid Password");
  return user;
};

const User = model("User", UserSchema);

function validateUser(body) {
  const schema = joi.object({
    email: joi.string().required().min(5).max(255).email(),
    password: joi.string().required().min(6).max(200),
    fullName: joi.string().min(3),
  });
  return schema.validate(body);
}

module.exports = { User, validateUser };
