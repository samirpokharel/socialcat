const { Router } = require("express");
const { login, register } = require("../controller/authController");
const auth = require("../middleware/auth");
const router = Router();

router.post("/login", login);
router.post("/register", register);

module.exports = router;
