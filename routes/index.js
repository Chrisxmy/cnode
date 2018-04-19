const express = require("express");
const router = express.Router();
const User = require("../models/mongo/users");

const JWT = require("jsonwebtoken");
const JWT_SECRET = require("../cipher").JWT_SECRET;

const Errors = require("../error");

router.post("/img");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", function(req, res, next) {
  (async () => {

    const user = await User.login(req.body.username, req.body.password);

    const token = JWT.sign(
      {
        _id: user._id,
        lat: Date.now(),
        expire: Date.now() + 1000 * 60 * 60 * 24
      },
      JWT_SECRET
    );
    return {
      code: 0,
      data: {
        user: user,
        token: token
      }
    };
  })()
    .then(r => {
      res.json(r);
    })
    .catch(e => {
      next(e);
    });
});



module.exports = router;
