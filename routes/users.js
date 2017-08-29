const express = require("express");
const router = express.Router();

const User = require("../models/mongo/users");
const auth = require('../middleware/auth_user')

const path  = require('path')
const multer = require('multer')

const upload = multer({dest: path.join(__dirname, '../public/images')})

const HOST = process.env.NODE_ENV === 'production' ? 'http://host/' : 'http:localhost:8686'

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
        name: req.body.username,
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
  .patch(auth(), upload.single('avatar'), (req, res, next) => {
    (async () => {
      let update = {}
      if(req.body.name) update.name = req.body.name
      update.avatar = `/public/images/${req.file.filename}`
      let user = await User.updateUserById(req.params.id, update);
      user.avatar = `${HOST}${user.avatar}`
      return {
        code: 0,
        user: user,
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
