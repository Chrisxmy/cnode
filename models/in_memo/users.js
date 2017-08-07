let USER_ID_INIT = 10000;

const users = [];

class User {
  constructor(params) {
    if (!params.name || !params.age)
      throw new Error("age and name required when required");
    this.name = params.name;
    this.age = params.age;
    this.id = USER_ID_INIT++;
  }
}

async function createNewUser(params) {
  const user = new User(params);
  users.push(user);
  return user;
}

async function getUsers(params) {
    return users

}

async function getUserById(userId) {
    return users.find(u => u.id === userId);

}

async function updateUserById(userId, update) {
    const user =  users.find(u => u.id === userId);
    if(update.name) user.name = update.name
    if(update.age) user.age = update.age
    return user
}

module.exports = {
    model: User,
    createNewUser,
    getUsers,
    getUserById,
    updateUserById
}
