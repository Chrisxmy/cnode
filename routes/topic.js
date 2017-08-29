const express = require("express");
const router = express.Router();
const User = require("../models/mongo/users");
const Topic = require("../models/mongo/topic");

const auth = require('../middleware/auth_user')

const path  = require('path')
const multer = require('multer')

const upload = multer({dest: path.join(__dirname, '../public/images')})


/* localhost:8888/topic/ */
router
  .route("/")
  .get((req, res, next) => {
    (async () => {
      let topics = await Topic.getTopics();
      return {
        code: 0,
        topics: topics
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
  .post(auth(),upload.single('titleImg'),(req, res, next) => {
    (async () => {
      let titleImg = `http://localhost:8686/images/${req.file.filename}`
      const user = await User.getUserById(req.body.userId)
      let topic = await Topic.createNewTopic({
        creator:user,
        title: req.body.title,
        content:req.body.content,
        titleImg: titleImg
      });
      return {
        code: 0,
        topics: topic
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
      let topic = await Topic.getTopicById(req.params.id);
      return {
        code: 0,
        topic: topic
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
      let topic = await Topic.updateTopicById(req.params.id, {
        title: req.body.title,
        content: req.body.content
      });
      return {
        code: 0,
        topic: topic
      };
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      });
  });

  router.route('/:id/reply')
    .post((req,res,next) => {
      (async () => {
           const user = await User.getUserById(req.body.userId)
           if(!user) {throw new Error('Invalid user id')}
           let topic = await Topic.createReply({
             topicId:req.params.id,
             replyer: user,
             content: req.body.content
           })
           return {
             code: 0,
             topic
           }
      })()
        .then(r => res.json(r))
        .catch(e=> next(e))
    })

module.exports = router;
