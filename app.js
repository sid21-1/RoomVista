const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs", { allListings });
});

//Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async (req, res) => {
  // let { title, description, image, price, country, location } = req.body;
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "my new villa",
//     description: "by the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// Connection with the server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
