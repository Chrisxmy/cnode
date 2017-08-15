const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  age: { type: Number }
});

const UserModel = mongoose.model("user", UserSchema);

async function createNewUser(params) {
  const user = new UserModel({
    name: params.name,
    age: params.age
  });
  return await user.save()
        .catch(e => {
          console.log(e);
          switch (e.code) {
            case 11000:
              throw Error("someone has picked that name");
              break
            default:
              throw Error(`error creating user ${JSON.stringify(params)}`);
              break
          }
        });
}

async function getUsers(params = { page: 0, pageSize: 10 }) {
  let flow = UserModel.find({});
  flow.skip(params.page * params.pageSize);
  flow.limit(params.pageSize);
  return await flow.catch(e => {
    throw new Error(e);
  });
}

async function getUserById(userId) {
  return await UserModel.findOne({ _id: userId }).catch(e => {
    throw new Error(e);
  });
}

async function updateUserById(userId, update) {
  return await UserModel.findOneAndUpdate({ _id: userId }, update, {
    new: true
  }).catch(e => {
    console.log(e);
    throw new Error(`error updating user by id: ${userId}`);
  });
}

module.exports = {
  model: UserModel,
  createNewUser,
  getUsers,
  getUserById,
  updateUserById
};
