const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { Client } = require("@googlemaps/google-maps-services-js");

const app = express();
dotenv.config({ path: "./config.env" });

const mongoDB = `mongodb+srv://lankanamigo:${process.env.DATABASE_PASSWORD}@cluster.2yzcprp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

const googleMapsClient = new Client();
app.use(express.json());

app.get("/calculate-route", async (req, res) => {
  // const {fromLocation,toLocation,travelMode} = req.query;
  const fromLocation = "Galle, Sri Lanka";
  const toLocation = "Ella, Sri Lanka";
  const apiKey = process.env.GOOGLEAPI;
  try {
    const directionsResponse = await googleMapsClient.directions({
      params: {
        origin: fromLocation,
        destination: toLocation,
        mode: "walking",
        key: apiKey,
      },
      timeout: 1000,
    });
    console.log(directionsResponse.data);
    res.json(directionsResponse.data);
  } catch (error) {
    console.error("Error calculating route:", error.response.data);
    res.status(500).json({ error: "Failed to calculate route" });
  }
});

app.get("/get-accomodations", async (req, res) => {
  try {
    const apiKey = process.env.TRIPADVISORAPI;
    const latLong = "6.9497%2C80.7891";
    const url = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${latLong}&key=${apiKey}&category=hotels&radius=3&radiusUnit=km&language=en`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(url, options);
    const jsonData = await response.json();

    // const accommodations = jsonData.data.map((data) => ({
    //   locationId: data.location_id,
    //   name: data.name,
    //   distance: data.distance,
    //   city: data.address_obj.city,
    //   address: data.address_obj.address_string,
    // }));

    // await Accommodation.insertMany(accommodations);
    

    res.json(jsonData);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({ error: "Failed to fetch accommodations" });
  }
});

app.get("/get-accomodations-details", async (req, res) => {
  // const {locationId} = req.query;
  const locationId = "19847553";
  const apiKey = process.env.TRIPADVISORAPI;

  const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${apiKey}&language=en&currency=USD`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  const response = await fetch(url, options);
  const jsonData = await response.json();

 
  res.json(jsonData);

 
});

app.get("/get-accomodations-photo", async (req, res) => {
  // const {locationId} = req.query;
  const locationId = "19847553";
  const apiKey = process.env.TRIPADVISORAPI;
  const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${apiKey}&language=en&limit=5`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
});

const PORT = process.env.PORT || 3002;

mongoose
  .connect(mongoDB)
  .then(() => {
    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("connected");
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
