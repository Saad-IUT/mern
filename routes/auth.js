const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcyprt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //Validate
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check duplicate username
  const userExist = await User.findOne({ name: req.body.name });
  if (userExist) return res.status(400).send("User already exists");
  
  //Check duplicate email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash passwords
  const salt = await bcyprt.genSalt(10);
  const hashedPassword = await bcyprt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.send(400).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  //Validate
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Check email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password doesn't match");
  //Check password
  const validPass = await bcyprt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send("Email or password doesn't match");

  //Assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
