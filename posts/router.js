const express = require("express");

const Posts = require("./postDb");
const Users = require("../users/userDb");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.get()
    .then(posts => {
      res.json(posts);
    })
    .catch(() => res.status(500).json({ message: "failed to get posts" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "post not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.post("/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(422).json({ message: "Text required" });
  } else {
    Users.getById(id)
      .then(user => {
        if (user) {
          Posts.insert({ text, user_id: id })
            .then(() => {
              Posts.get().then(posts => {
                res.json(posts);
              });
            })
            .catch(() => {
              res.status(400).json({ message: "Failed to add post" });
            });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Server Error" });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(422).json({ message: "Text required" });
  } else {
    Users.getById(id).then(user => {
      if (user) {
        Posts.update(id, { text })
          .then(result => {
            if (result) {
              Posts.get().then(posts => {
                res.status(203).json(posts);
              });
            } else {
              res.status(500).json({ message: "failed to update post" });
            }
          })
          .catch(() => {
            res.status(500).json({ message: "Server Error" });
          });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then(result => {
      if (result) {
        Posts.get().then(posts => {
          res.json(posts);
        });
      } else {
        res.status(400).json({ message: "failed to delete post" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Server Error" });
    });
});

module.exports = router;
