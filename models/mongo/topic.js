const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
  content:{type: String, required: true},
  userId: {type: String}
})

const TopicSchema = new Schema({
  creator: { type: String},
  title: { type: String,required: true},
  content: { type: String, required: true },
  replyLists: [replySchema]
});

const TopicModel = mongoose.model("topic", TopicSchema);

async function createNewTopic(params) {
  const topic = new TopicModel({
    creator: params.creator._id,
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

async function createReply(params) {
  return await TopicModel.findOneAndUpdate(
    {_id: params.topicId},
    {$push: {replyLists: {creator: params.creator, content: params.content}}},
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
  getTopicById,
  updateTopicById,
  createReply
};
