const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

// Connection with the database
const mongo_url = "mongodb://127.0.0.1:27017/roomvista";
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

// API's
app.get("/", (req, res) => {
  res.send("hi I am root");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "my new villa",
    description: "by the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });

  await sampleListing.save();
  console.log("sample was saved");
  res.send("successful testing");
});

// Connection with the server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
