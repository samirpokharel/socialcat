module.exports = function (err, req, res, next) {
  console.log(err);
  let error = {
    sucess: false,
    errors: {
      email: "",
      password: "",
    },
  };

  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error.errors[properties.path] = properties.message;
    });
    return res.status(400).send(error);
  }
  if (err.code === 11000) {
    error.errors.email = "The User with This email already exist";
    return res.status(400).send(error);
  }
  if (err.message.includes("Invalid Email")) {
    error.errors.email = "No account found with this email";
    return res.status(400).send(error);
  }
  if (err.message.includes("Invalid Password")) {
    error.errors.password = "Invalid User password";
    return res.status(400).send(error);
  }

  next();
};
