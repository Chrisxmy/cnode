
const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/one'
mongoose.Promise = global.Promise;

mongoose.connect(uri,{useMongoClient:true})

const db = mongoose.connection




db.on("err", (err, data) => {
  console.log(err), console.log(data);
});

db.once('open', () => {
  console.log('success connect')
});


module.exports = db