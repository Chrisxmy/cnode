const express = require("express");
const router = express.Router();
const User = require("../models/mongo/users");
const Topic = require("../models/mongo/topic");

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
  .post((req, res, next) => {
    (async () => {
      const user = await User.getUserById(req.body.userId)
      let topic = await Topic.createNewTopic({
        creator: user.id,
        title: req.body.title,
        content:req.body.content
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
  .patch((req, res, next) => {
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

module.exports = router;
