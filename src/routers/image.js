const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const {
  upload,
  createBufferArray
} = require("../middleware/upload")
const auth = require("../middleware/auth")
const Image = require("../models/image")

// uploadImage
// Params: { private: bool, images: Image}
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

// getUploads
// Params: { ?userId: string, ?private: string(bool),}
// userId<Optional>: If not the same ID as the requesting user, this will only return public images.
// private<Optional>: This is only used if the userId provided is the same as the requesting user's Id. Setting this to true will only return private, false will only return public. If not present, both private and public are displayed.
router.get("/image", auth, async (req, res) => {
  try {
    const match = {}
    const isSelfRequest = req.body.userId == req.user._id.toString()
    if (req.body.userId) {
      match.uploader = mongoose.Types.ObjectId(req.body.userId)
    }
    if (!isSelfRequest) {
      match.private = false
    } else if (req.query.private) {
      match.private = req.query.private == "true"
    }
    const images = await Image.find(match)
    res.send(images)
  } catch (err) {
    res.status(400).send()
  }
})

// getSelfUploads
// GET uploads/me?private={bool}
// Params: N/A
router.get("/image/me", auth, async (req, res) => {
  try {
    const match = {}
    if (req.query.private) {
      match.private = req.query.private == "true"
    }
    match.uploader = req.user._id
    const images = await Image.find(match)
    res.send(images)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

// setImagePrivate
// Request Params; imageIds: [{imageId}]
router.patch("/image/private", auth, async (req, res) => {
  try {
    const imageIds = req.body.imageIds
    const images = await Image.find({
      uploader: req.user._id
    }).where("_id").in(imageIds).exec()
    if (images.length == 0) {
      res.status(404).send()
    }
    await Promise.all(images.map((image) => {
      image.private = true
      return image.save()
    })).then(() => {
      res.status(200).send(images)
    })
  } catch (err) {
    res.status(400).send()
  }
})

// setImagePublic
// Request Params; imageIds: [{imageId}]
router.patch("/image/public", auth, async (req, res) => {
  try {
    const imageIds = req.body.imageIds
    const images = await Image.find({
      uploader: req.user._id
    }).where("_id").in(imageIds).exec()
    if (images.length == 0) {
      res.status(404).send()
    }
    await Promise.all(images.map((image) => {
      image.private = false
      return image.save()
    })).then(() => {
      res.status(200).send(images)
    })
  } catch (err) {
    res.status(400).send()
  }
})

// deleteUploadsById
// Allows for batch deletes
// Params: imageIds: [{imageId}]
router.delete("/image", auth, async (req, res) => {
  try {
    const imageIds = req.body.imageIds
    const images = await Image.find({
      uploader: req.user._id
    }).where("_id").in(imageIds).exec()
    if (images.length == 0) {
      res.status(404).send()
    }
    images.map((image) => {
      image.delete()
    })
    res.status(202).send()
  } catch (err) {
    res.status(400).send()
  }
})

// deleteAllUploads
// Async delete sends 202 and processes deletions in the background
// Params: N/A
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