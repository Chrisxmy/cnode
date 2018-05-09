const express = require("express");
const router = express.Router();
const User = require("../models/mongo/users");

const response = require('../utils/response')


const PointService = require('../servers/point_service')

const JWT = require("jsonwebtoken");
const JWT_SECRET = require("../cipher").JWT_SECRET;

const Errors = require("../error");

router.post("/img");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

/**
 * @api {post} /login 登陆
 * @apiVersion 0.1.0
 * @apiDescription 登陆接口
 * @apiParam {string} username 用户名
 * @apiParam {string} passward 密码
 * 
 * @apiSuccess {Object} user 用户对象
 * @apiSuccess {String} user.name 用户名
 * @apiSuccess {String} user.token token
 * 
 * @apiSuccessExample {json} 示例
 * {
 *   code:0,
 *   user: {}
 * }
 * 
 * @apiSampleRequest 127.0.0.1:8686/login
 */

router.post("/login", function(req, res, next) {
  (async () => {

    const user = await User.login(req.body.username, req.body.password);

    const token = JWT.sign(
      {
        _id: user._id,
        lat: Date.now(),
        expire: Date.now() + 1000 * 60 * 60 * 24
      },
      JWT_SECRET
    );
    return {
      code: 0,
      data: {
        user: user,
        token: token
      }
    };
  })()
  .then((r) => {
    res.data = r
    response(req, res, next)
  })
    .catch(e => {
      next(e);
    });
});

router.get('/score', (req, res, next) => {
  (async () => {
    let users = await PointService.getPointsRankBrief();
    return {
      code: 0,
      user: users
    };
  })()
  .then((r) => {
    res.data = r
    response(req, res, next)
  })
    .catch(e => {     
      next(e);
    });
})



module.exports = router;
