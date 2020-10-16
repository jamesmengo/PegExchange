const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://James1:admin@cluster0.lx0jx.gcp.mongodb.net/PegExchange_Dev?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log("Connected to server")
});
mongoose.connection.on('error', () => {
  console.log("Error connecting to server")
});
mongoose.connection.on('disconnected', () => {
  console.log("Disconnected from server")
});