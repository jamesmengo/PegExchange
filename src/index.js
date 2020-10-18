// // Start server here
const dotenv = require("dotenv")
dotenv.config({
  path: "./config/dev.env"
})

require("./database.js")
const server = require("./server.js")

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})