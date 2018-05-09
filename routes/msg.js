
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth_user')
const MsgService = require('../servers/msg_service')
const response = require('../utils/response')


router.route('/')
.get(auth(), (req, res, next) => {
    (async () => {

      const userId = req.query._id
      const page = Number(req.query.page) || 0
      const pageSize = Number(req.query.pageSize) || 10

      const msgs = await MsgService.getUserReceivedMsgs({
        userId,
        page,
        pageSize,
      })
      return {
        code:0,
        msgs,
      }

    })()
    .then((r) => {
      res.data = r
      response(req, res, next)
    })
      .catch(e => {
        next(e)
      })
  })
.post(auth(), (req, res, next) => {
 (async () => {
    const { from, to, content } = req.body
    const msg = await MsgService.sendAMsgByUser(from, to, content)

    return {
      code: 0,
      msg
    }
  })()
  .then((r) => {
    res.data = r
    response(req, res, next)
  })
    .catch(e => {
      next(e)
    })
})


module.exports = router
