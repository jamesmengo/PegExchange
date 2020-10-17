const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const {
  upload,
  createBufferArray
} = require("../middleware/upload")
const auth = require("../middleware/auth")
const Image = require("../models/image")

router.post("/image", auth, upload.array("images"), async (req, res) => {
  try {
    const imageBufferArray = await createBufferArray(req.files);
    await Promise.all(imageBufferArray.map((buffer) => {
      const image = new Image({
        image: buffer,
        uploader: req.user._id,
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

// Get my uploads
// GET uploads/me?private={bool}
router.get("/image/me", auth, async (req, res) => {
  const match = {}
  if (req.query.private) {
    match.private = req.query.private === 'true'
  }
  try {
    match.uploader = req.user._id
    const images = await Image.find(match)
    res.send(images)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

// Async delete sends 202 and processes deletions in the background
router.delete("/image/all", auth, async (req, res) => {
  try {
    const images = await Image.find({
      uploader: req.user._id
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