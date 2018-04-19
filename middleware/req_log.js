const logger = require("../utils/loggers").reqLogger;


function logRequests(options) {

  return function(req, res, next) {
    const content = {
      method: req.method,
      statusCode: req.statusCode,
      originalUrl: req.originalUrl,
      body: req.body,
      query: req.query,
      ip: req.ip || req.ips,
      user: req.user || undefined
    };

    logger.info("request", content);
    next()
  };
}

module.exports = {
  logRequests
};
