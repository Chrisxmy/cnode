const User = require('../models/mongo/users')
const Topic = require('../models/mongo/topic')
const PointsOp = require('../models/mongo/points_op')
const Like = require('../models/mongo/like')
const {ObjectId} = require('mongoose').Types
const PointService = require('./point_service')


async function likeTopic (userId, attachedId, targetId) {
  await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.TOPIC)
  await Topic.likeATopic(attachedId)
  await PointService.incrUserPoints(ObjectId(targetId), 10, PointsOp.POINTS_OP_TYPES.LIKE)
  return true
}

async function likeReply (userId, attachedId, targetId) {
  await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.REPLY)
  await Topic.likeAReply(attachedId)
  await PointService.incrUserPoints(ObjectId(targetId), 10, PointsOp.POINTS_OP_TYPES.REPLY)
  return true
}

async function disLikeTopic (userId, attachedId,targetId) {
  await PointService.incrUserPoints(ObjectId(targetId), -10, PointsOp.POINTS_OP_TYPES.LIKE)  
  await Like.dislike(userId, attachedId)
  await Topic.disLikeATopic(attachedId)
  return true
}

async function dislikeReply (userId, attachedId,targetId) {
  await Like.dislike(userId, attachedId)
  await Topic.dislikeAReply(attachedId)
  await PointService.incrUserPoints(ObjectId(targetId), -10, PointsOp.POINTS_OP_TYPES.REPLY)
  return true
}

module.exports = {
  likeReply,
  likeTopic,
  disLikeTopic,
  dislikeReply,
}