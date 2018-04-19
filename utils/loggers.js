const winston = require('winston')
require('winston-daily-rotate-file')

const logger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'error-logger',
      filename: process.cwd() + '/logs/info.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error'
    }),
    new winston.transports.DailyRotateFile({
      name: 'info-logger',
      filename: process.cwd() + '/logs/error.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    })
  ]
})

const reqLogger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'req-logger',
      filename: process.cwd() + '/logs/req.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    })
  ]
})

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  logger.add(winston.transports.Console)
  reqLogger.add(winston.transports.Console)
}

module.exports = {
  logger: logger,
  reqLogger: reqLogger
}
