const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  creatorId: { type: Number },
  title: { type: String },
  content: { type: String }
});

const TopicModel = mongoose.model("topic", TopicSchema);

async function createNewTopic(params) {
  const topic = new TopicModel({
    creator: params.creator,
    title: params.title,
    content: params.content
  });
  return await topic.save().catch(e => {
    console.log(e);
    throw Error(e);
  });
}

async function getTopics(params = { page: 0, pageSize: 10 }) {
  let flow = TopicModel.find({});
  flow.skip(params.page * params.pageSize);
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

module.exports = {
  model: TopicModel,
  createNewTopic,
  getTopics,
  getTopicById,
  updateTopicById
};
