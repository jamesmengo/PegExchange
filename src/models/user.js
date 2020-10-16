const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    default: 1
  }
})

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password
  return userObject
}

userSchema.statics.handleLogin = async (username, password) => {
  const user = await User.findOne({
    username
  });
  if (!user) {
    throw new Error("Unable to login");
  }
  return user;
}

const User = mongoose.model("User", userSchema)

module.exports = User;