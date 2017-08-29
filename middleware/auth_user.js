const JWT = require("jsonwebtoken");
const JWT_SECRET = require("../cipher").JWT_SECRET;

module.exports = function(options) {
  return function(req, res, next) {
    try {
      const auth = req.get("Authorization");
      if(!auth) throw new Error('no auth')
      let authList = auth.split(' ')
      const token = authList[1];
      if (!auth || auth.length < 2) {
        next(new Error("no auth"));
        return;
      }
      const obj = JWT.verify(token, JWT_SECRET);
      if (!obj || !obj._id || !obj.expire) throw new Error("no auth");
      if (Date.now() - obj.expire > 0) throw new Error("token expired");
      next();
    } catch (e) {
      e.status = 401
      next(e);
    }
  };
};
