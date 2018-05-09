var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var users = require('./routes/users')
var topic = require('./routes/topic')
var msgRouter = require('./routes/msg');


require('./servers/mongdb_server')
const Errors = require('./error')
const logger = require('./utils/loggers').logger

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(require('./middleware/req_log').logRequests())

app.use('/', index)
app.use('/users', users)
app.use('/topic', topic)
app.use('/msg', msgRouter)

app.use(function(req) {
  if (req.pathName === '/favicon.ico') {
    next()
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  if (err instanceof Errors.httpError) {
    res.status(err.httpCode)
    res.json({
      code: err.OPCode,
      msg: err.httpMsg
    })
  } else {
    res.statusCode = 500
    res.json({
      code: Errors.httpError.DEFAULT_OPCODE,
      msg: '服务器好像出错了，请检查后再试'
    })
  }
  logger.error('response error to user', err)
})

module.exports = app
