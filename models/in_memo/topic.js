let TOPIC_ID_INIT = 10000;

const topics = [];

class Topic {
  constructor(params) {
    if (!params.creator) throw new Error({error:-1, msg:"a topic must be sent by a creater" });
    if (!params.title) throw new Error({error:-1, msg:"a topic must be sent by a title" });
    if (params.content.length < 5) throw new Error({error:-1, msg:"a topic's content must be longer than 5 charaster" });
    this.userId = params.creator
    this.topic_id = TOPIC_ID_INIT++;
    this.title = params.title;
    this.content = params.content;
  }
}

async function createNewTopic(params) {
  const topic = new Topic(params);
  topics.push(topic);
  return topic;
}

async function getTopics(params) {
    return topics

}

async function getTopicById(topicId) {
    return topics.find(u => u.topic_id === Number(topicId));

}

async function updateTopicById(topicId, update) {
    const topic =  topics.find(u => u.topic_id === topicId);
    if(update.title) topic.title = update.title
    if(update.content) topic.content = update.content
    return topic
}

module.exports = {
    model: Topic,
    createNewTopic,
    getTopics,
    getTopicById,
    updateTopicById
}
