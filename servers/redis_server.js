const Redis = require('ioredis')

let redis = new Redis({
    host:'127.0.0.1',
    port:6379,
})

 module.exports = redis