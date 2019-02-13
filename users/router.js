const express = require("express");

const Users = require("./userDb");

const router = express.Router();

const upperName = (req, res, next) => {
  req.body.name = req.body.name.toUpperCase();
  next();
};

router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.json(users);
    })
    .catch(() => res.status(500).json({ message: "Server Error" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Error getting user" });
    });
});

router.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(posts => {
      res.json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: "failed to get posts" });
    });
});

router.post("/", upperName, (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(422).json({ message: "Name required" });
  } else {
    Users.insert({ name })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({ message: "Error adding user to Database" });
      });
  }
});

router.put("/:id", upperName, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    res.status(422).json({ message: "Name required" });
  } else {
    Users.getById(id)
      .then(user => {
        if (user) {
          Users.update(id, { name })
            .then(result => {
              if (result) {
                Users.get().then(users => {
                  res.json(users);
                });
              } else {
                res.status(500).json({ message: "Failed to update user" });
              }
            })
            .catch(() => {
              res.status(400).json({ message: "failed to update user" });
            });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Server error" });
      });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Users.removeUserPosts(id)
    .then(result => {
      if (result) {
        Users.remove(id).then(result => {
          if (result) {
            Users.get().then(users => {
              res.json(users);
            });
          } else {
            res.status(404).json({ message: "Failed to delete user" });
          }
        });
      } else {
        res.status(500).json({ message: "failed to delete user posts" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Server Error" });
    });
});

module.exports = router;
