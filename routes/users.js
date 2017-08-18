const express = require("express");
const router = express.Router();

const User = require("../models/mongo/users");
const auth = require('../middleware/auth_user')

/* localhost:8888/user/ */
router
  .route("/")
  .get((req, res, next) => {
    (async () => {
      let user = await User.getUsers();
      return {
        code: 0,
        user: user
      };
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      });
    // res.send("tring to get uesr list");
  })
  .post((req, res, next) => {
    (async () => {
      let users = await User.createNewUser({
        name: req.body.name,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      });
      return {
        code: 0,
        users: users
      };
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      });
  });

router
  .route("/:id")
  .get((req, res, next) => {
    (async () => {
      let user = await User.getUserById(req.params.id);
      return {
        code: 0,
        user: user
      };
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      });
  })
  .patch(auth(),(req, res, next) => {
    (async () => {
      let user = await User.updateUserById(req.params.id, {
        name:req.body.name,
        age:req.body.age
      });
      return {
        code: 0,
        user: user
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
