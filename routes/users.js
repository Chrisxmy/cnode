const express = require("express");
const router = express.Router();

const User = require("../models/mongo/users");
const auth = require('../middleware/auth_user')

const Like = require('../models/mongo/like')
const response = require('../utils/response')


const path  = require('path')
const multer = require('multer')

const upload = multer({dest: path.join(__dirname, '../public/images')})

const HOST = process.env.NODE_ENV === 'production' ? 'http://host/' : 'http://localhost:8686'

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
        password: req.body.password
      });
      return {
        code: 0,
        users: users
      };
    })()
      .then(r => {
        res.data = r
        response(req, res, next)
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
      req.user = user
      return {
        code: 0,
        user: user
      };
    })()
      .then(r => {
        res.data = r
        response(req, res, next)
      })
      .catch(e => {     
        next(e);
      });
  })
  .patch(auth(), upload.single('avatar'), (req, res, next) => {
    (async () => {
      console.log(req.file)
      console.log(req.body)
      let update = {}
      if(req.body.name) update.name = req.body.name
      update.avatar = `${HOST}/images/${req.file.filename}`
      let user = await User.updateUserById(req.params.id, update);
      return {
        code: 0,
        user: user,
      };
    })()
      .then(r => {
        res.data = r
        response(req, res, next)
      })
      .catch(e => {
        next(e);
      });
  });


  router
  .route("/:id/likes")
  .post((req, res, next) => {
    (async () => {
      let user = await Like.getMyLikes(req.params.id,'topic');
      return {
        code: 0,
        user: user
      };
    })()
      .then(r => {
        res.data = r
        response(req, res, next)
      })
      .catch(e => {
        next(e);
      });
    // res.send("tring to get uesr list");
  })

 

module.exports = router;
