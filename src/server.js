const express = require("express")

const server = express();

// JSON HTTP Request Middleware
server.use(express.json());

// Routers
server.get("/", (req, res) => {
  res.send("hello")
})

module.exports = server;