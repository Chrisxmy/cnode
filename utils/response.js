const MsgService = require('../servers/msg_service')
const logger = require('../utils/loggers').logger

function response (req, res, next) {

  (async () => {

    const data = res.data || {}

    console.log(req.user)

    if(req.user) data.unread = await MsgService.getUserUnreadCount(req.user._id)

    res.json(data)

  })()
    .catch(e => {
      logger.error('error sending response', {err: e.stack || e})
    })
}

module.exports = response