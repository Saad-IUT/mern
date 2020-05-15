const router = require("express").Router();
const verify = require("./private");
const User = require("../model/User");

//Read all users
router.get("/", verify, (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Read specific user
router.get("/:id", verify, (req, res) => {
  User.findById(req.params.id)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Update user
router.post("/update/:id", verify, (req, res) => {
  User.findById(req.params.id)
    .then((users) => {
      users.name = req.body.name;
      users.email = req.body.email;

      users
        .save()
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete user
router.delete("/:id", verify, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
