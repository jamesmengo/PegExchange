const express = require("express")
const userRouter = require("./routers/user")
const imageRouter = require("./routers/image")

const server = express();

// JSON HTTP Request Middleware
server.use(express.json());

// Routers
server.use(userRouter)
server.use(imageRouter)

module.exports = server;