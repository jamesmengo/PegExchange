const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require("../../src/models/user")

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  credits: 1,
  username: "user1",
  password: 'test123',
  tokens: [{
    token: jwt.sign({
      _id: userOneId
    }, process.env.JWT_SECRET)
  }]
}


const setUpDatabase = async () => {
  await User.deleteMany({})
  await new User(userOne).save()
}

module.exports = {
  setUpDatabase,
  userOne
}