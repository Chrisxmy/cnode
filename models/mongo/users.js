const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const bluebird = require("bluebird");
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2);
const SALT = require("../../cipher").PASSWORD_SALT;
const Errors = require("../../error");
const logger = require('../../utils/loggers').logger

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: String,
  avatar: String
});

const DEFAULT_PROJECTION = { password: 0, phoneNumber: 0 };

const UserModel = mongoose.model("user", UserSchema);

async function createNewUser(params) {
  const user = new UserModel({
    name: params.name,
    password: params.password,
  });

  user.password = await pbkdf2Async(user.password, SALT, 512, 128, "sha1")
    .then()
    .catch(e => {
      throw new Error("something goes wrong");
    });

  let created = await user.save().catch(e => {
    switch (e.code) {
      case 11000:
        logger.error('error creating  user' , e)
        throw new Errors.sign(params.name);
        break;
      default:
        throw new Errors.ValidationError('user',`error creating user ${JSON.stringify(params)}`);
        break;
    }
  });
  return {
    _id: created._id,
    name: created.name,
    age: params.age
  };
}

async function getUsers(params = { page: 0, pageSize: 10 }) {
  let flow = UserModel.find({});
  flow.select(DEFAULT_PROJECTION);
  flow.skip(params.page * params.pageSize);
  flow.limit(params.pageSize);
  return await flow.catch(e => {
    throw new Error(e);
  });
}

async function getUserById(userId) {
  return await UserModel.findOne({ _id: userId })
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      throw new Error(e);
    });
}

async function updateUserById(userId, update) {
  return await UserModel.findOneAndUpdate({ _id: userId }, update, {
    new: true
  })
  .select(DEFAULT_PROJECTION)
  .catch(e => {
    console.log(e);
    throw new Error(`error updating user by id: ${userId}`);
  });
}
async function login(username, password) {
     password = await pbkdf2Async(password, SALT, 512, 128, "sha1")
    .then(r => r.toString())
    .catch(e => {
      console.log(e);
      throw new Errors.InternalError("something goes wrong inside the server");
    });
  const user =  await UserModel.findOne({ name:username, password:password})
      .select(DEFAULT_PROJECTION)
      .catch(e=>{
        console.log(`error logging in ,phone ${phoneNumber}`, {err:e.stack || e})
         throw new Errors.InternalError("something goes wrong inside the server");
      })

      if(!user)  throw new Errors.login()
      return user       
}

module.exports = {
  model: UserModel,
  createNewUser,
  getUsers,
  getUserById,
  updateUserById,
  login
};


