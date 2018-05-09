const express = require("express");
const router = express.Router();
const User = require("../models/mongo/users");
const Topic = require("../models/mongo/topic");

const LikeService = require('../servers/like_server.js')

const auth = require('../middleware/auth_user')

const path  = require('path')
const multer = require('multer')

const upload = multer({dest: path.join(__dirname, '../public/images')})

const response = require('../utils/response')


/* localhost:8888/topic/ */
router
  .route("/")
  .get(auth(),(req, res, next) => {
    (async () => {
      let params = {
         pageNumber: Number(req.query.pageNumber),
         pageSize: Number(req.query.pageSize)
      } 
      let topics = await Topic.getTopics(params);
      let users = await User.getUsers()
      topics.forEach(topic => {
        users.forEach(user => {     
          if(topic.creator._id.toString() === user._id.toString()) {
            topic.creator = user  
           }
        })
      });
      let count = await Topic.getTopicsCount()
      return {
        code: 0,
        topics: topics,
        count: count
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
  // upload.single('titleImg')
  .post(auth(),(req, res, next) => {
    (async () => {
      // let titleImg = `http://localhost:8686/images/${req.file.filename}`
      const user = await User.getUserById(req.body.userId)
      let topic = await Topic.createNewTopic({
        creator:user,
        title: req.body.title,
        content:req.body.content,
        // titleImg: titleImg
      });
      return {
        code: 0,
        topics: topic
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
      let topic = await Topic.getTopicById(req.params.id);
      return {
        code: 0,
        topic: topic
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
        res.data = r
        response(req, res, next)
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
        .then((r) => {
          res.data = r
          response(req, res, next)
        })
        .catch(e=> next(e))
    })

  router.route('/:id/like')
    .patch(auth(),(req,res,next) => {
      (async () => {
          await LikeService.likeTopic(req.body.userId, req.params.id, req.body.targetId)
           return {
             code: 0,
           }
      })()
      .then((r) => {
        res.data = r
        response(req, res, next)
      })
        .catch(e=> next(e))
    })
    .delete(auth(),(req,res,next) => {
      (async () => {
           await LikeService.disLikeTopic(req.body.userId, req.params.id, req.body.targetId)
           return {
             code: 0,
           }
      })()
      .then((r) => {
        res.data = r
        response(req, res, next)
      })
        .catch(e=> next(e))
    })

    router.route('/:id/reply/:replyId/like')
    .patch(auth(),(req,res,next) => {
      (async () => {
        await LikeService.likeReply(req.params.id, req.params.replyId, req.body.targetId)
           return {
             code: 0,
           }
      })()
      .then((r) => {
        res.data = r
        response(req, res, next)
      })
        .catch(e=> next(e))
    })
    .delete(auth(),(req,res,next) => {
      (async () => {
        await LikeService.dislikeReply(req.params.id, req.params.replyId, req.body.targetId)
           return {
             code: 0,
           }
      })()
      .then((r) => {
        res.data = r
        response(req, res, next)
      })
        .catch(e=> next(e))
    })

module.exports = router;
