const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  image: {
    type: Buffer,
    required: true
  },
  private: {
    type: Boolean,
    default: false
  },
  upvotes: {
    type: Number,
    default: 0
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
})

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;