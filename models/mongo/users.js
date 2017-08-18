const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const bluebird = require("bluebird");
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2);
const SALT = require("../../cipher").PASSWORD_SALT;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  age: { type: Number, max: [90, "nobody over 90 could use postman"] },
  phoneNumber: String,
  password: String
});

const DEFAULT_PROJECTION = { password: 0, phoneNumber: 0 };

const UserModel = mongoose.model("user", UserSchema);

async function createNewUser(params) {
  const user = new UserModel({
    name: params.name,
    age: params.age,
    phoneNumber: params.phoneNumber,
    password: params.password
  });

  user.password = await pbkdf2Async(user.password, SALT, 512, 128, "sha1")
    .then()
    .catch(e => {
      console.log(e);
      throw new Error("something goes wrong");
    });

  let created = await user.save().catch(e => {
    console.log(e);
    switch (e.code) {
      case 11000:
        throw Error("someone has picked that name");
        break;
      default:
        throw Error(`error creating user ${JSON.stringify(params)}`);
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
async function login(phoneNumber, password) {
     password = await pbkdf2Async(password, SALT, 512, 128, "sha1")
    .then(r => r.toString())
    .catch(e => {
      console.log(e);
      throw new Error("something goes wrong");
    });
  const user =  await UserModel.findOne({ phoneNumber:phoneNumber, password:password})
      .select(DEFAULT_PROJECTION)
      .catch(e=>{
        console.log(`error logging in ,phone ${phoneNumber}`, {err:e.stack || e})
        throw new Error('something wrong with server')
      })

      if(!user) throw Error('no such user')
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
