const express = require("express")
const userRouter = require("./routers/user")

const server = express();

// JSON HTTP Request Middleware
server.use(express.json());

// Routers
server.use(userRouter)

module.exports = server;