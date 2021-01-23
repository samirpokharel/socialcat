module.exports.errorResponse = (error) => ({
  sucess: false,
  message: error.message,
});

module.exports.userResponse = (user, token) => ({
  sucess: true,
  data: {
    email: user.email,
    uid: user._id,
    token: token,
  },
});
