// process.on('uncaughtException',(e) => {

//     console.log(e.message)
//     process.exit(1)
// })

// process.on('unhandledRejection',(reason,p) => {

//     console.log(p)

// })

// new Promise((rl,rj) => {
//     rj('reject')
// }).catch(e=>{

// })

// const winston = require("winston");
// require('winston-daily-rotate-file')

// const logger = new winston.Logger({
//   transports: [
//     new winston.transports.DailyRotateFile({
//       name: "error-logger",
//       filename: "./log/error.log",
//       datePattern:'YYYY-MM-DD-HH',
//       level: "error"
//     }),
//     new winston.transports.DailyRotateFile({
//       name: "info-logger",
//       filename: "./log/info.log",
//       datePattern:'YYYY-MM-DD-HH',
//       level: "info"
//     }),
//   ]
// });



// if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//     logger.add(winston.transports.Console)
// }

// logger.info('info')


// const MongoClient = require('mongodb').MongoClient



// var url = 'mongodb://localhost:27119/one';


MongoClient.connect(url, function(err, client){
    if (err) throw err;
        var collection = client.db('one').collection('users');
    for (var i = 0; i < 10 ; i++) {
        collection.insert({name:Math.ceil(Math.random()*10000).toString()})
        
    }
})

