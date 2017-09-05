const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
  content:{type: String, required: true},
  replyer: {type: Object}
})

const TopicSchema = new Schema({
  creator: { type: Object},
  title: { type: String,required: true},
  content: { type: String, required: true },
  replyLists: [replySchema],
  time: { type: String},
  titleImg: {type: String}
});

const TopicModel = mongoose.model("topic", TopicSchema);

async function createNewTopic(params) {
  const topic = new TopicModel({
    creator: params.creator,
    title: params.title,
    content: params.content,
    time: Date.now(),
    titleImg: params.titleImg
  });
  return await topic.save().catch(e => {
    console.log(e);
    throw Error(e);
  });
}``


async function getTopicsCount() {
  return await TopicModel.find({}).count()
}

async function getTopics(params = { pageNumber: 0, pageSize: 5 }) {
  let flow = TopicModel.find({});
  let count = TopicModel.find({}).count()
  flow.skip(params.pageNumber * params.pageSize);
  flow.limit(params.pageSize);
  return await flow.catch(e => {
    throw new Error(e);
  });
}

async function getTopicById(topicId) {
   return await TopicModel.findOne({ _id: topicId }).catch(e => {
    throw new Error(e);
  });
}

async function updateTopicById(topicId, update) {
   return await TopicModel.findOneAndUpdate({ _id: topicId }, update, {
    new: true
  }).catch(e => {
    console.log(e);
    throw new Error(`error updating user by id: ${userId}`);
  });
}

async function createReply(params) {
  return await TopicModel.findOneAndUpdate(
    {_id: params.topicId},
    {$push: {replyLists: {replyer: params.replyer, content: params.content}}},
    {new: true})
    .catch(e => {
      console.log(e)
      throw new Error(`error replying topic ${JSON.stringify(params)}`)
    })
}

module.exports = {
  model: TopicModel,
  createNewTopic,
  getTopics,
  getTopicsCount,
  getTopicById,
  updateTopicById,
  createReply
};
