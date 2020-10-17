const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const Image = require("../models/image")
const User = require("../models/user")
const sharp = require("sharp")
const multer = require("multer")

const upload = multer({
  limits: {
    fileSize: 16000000
  }
})

const createBufferArray = async (files) => {
  try {
    const imageBuffers = await Promise.all(files.map((file) => sharp(file.buffer).resize({
      height: 1080,
      width: 1920
    }).png().toBuffer()))
    return imageBuffers
  } catch (err) {
    return []
  }
}

// Get all images of the user
router.get("/image/me", async (req, res) => {
  try {
    const images = await Image.find({
      uploader: mongoose.Types.ObjectId(req.body.uploader)
    })
    console.log("images:", images)
    if (!images) {
      images = []
    }
    res.status(200).send(images)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

// // Get 10 images with option to sort by popularity
// // TODO:
// router.get("/image/all", async (req, res) => {
//   try {
//     const images = Image.find
//   } catch (err) {

//   }
// })

router.post("/image", upload.array("images"), async (req, res) => {
  try {
    const user = await User.findById(mongoose.Types.ObjectId(req.body.uploader));
    if (!user) throw new Error;
    const imageBufferArray = await createBufferArray(req.files);
    await Promise.all(imageBufferArray.map((buffer) => {
      const image = new Image({
        image: buffer,
        uploader: user._id,
        private: req.body.private
      })
      return image.save();
    })).then((buffers) => {
      res.status(201).send(buffers)
    })
  } catch (err) {
    res.status(400).send();
  }
})

// Async delete sends 202 and processes deletions in the background
router.delete("/image/all", async (req, res) => {
  try {
    const images = await Image.find({
      uploader: mongoose.Types.ObjectId(req.body.uploader)
    })
    images.map((image) => {
      image.delete();
    })
    res.status(202).send()
  } catch (err) {
    res.status(400).send();
  }
})

module.exports = router;