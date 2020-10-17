const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://James1:admin@cluster0.lx0jx.gcp.mongodb.net/PegExchange_Dev?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to database")
}).catch((err) => {
  console.log("Error connecting to server")
})