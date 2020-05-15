const router = require("express").Router();
const verify = require("./private");
const Post = require("../model/Post");

//Create post
router.post("/add", verify, (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  const newPost = new Post({
    title,
    description,
  });

  newPost
    .save()
    .then(() => res.json("Post created"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Read all post
router.get("/", verify, (req, res) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Read specific post
router.get("/:id", verify, (req, res) => {
  Post.findById(req.params.id)
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Update post
router.put("/:id", verify, (req, res) => {
  Post.findById(req.params.id)
    .then((posts) => {
      posts.title = req.body.title;
      posts.description = req.body.description;

      posts
        .save()
        .then(() => res.json("Post updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete post
router.delete("/:id", verify, (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
