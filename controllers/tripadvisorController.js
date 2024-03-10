const fetch = require("node-fetch");
const Accommodation = require("./../models/Accommodation.js");
const AccommodationDetail = require("./../models/AccommodationDetail.js");

exports.getAccommodations = async (req, res) => {
  try {
    const apiKey = process.env.TRIPADVISORAPI;
    const latLong = "6.9497%2C80.7891";
    const url = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${latLong}&key=${apiKey}&category=hotels&radius=3&radiusUnit=km&language=en`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(url, options);
    const jsonData = await response.json();

    const accommodations = [];
    for (const data of jsonData.data) {
      const locationId = data.location_id;

      const existingAccommodation = await Accommodation.findOne({ locationId });
      if (!existingAccommodation) {
        accommodations.push({
          locationId,
          name: data.name,
          distance: data.distance,
          city: data.address_obj.city,
          address: data.address_obj.address_string,
        });
      }
    }

    if (accommodations.length > 0) {
      await Accommodation.insertMany(accommodations);
    }

    // res.json(accommodations);
    res.json(jsonData.data);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({ error: "Failed to fetch accommodations" });
  }
};

exports.getAccommodationsDetails = async (req, res) => {
  const locationId = "19847553";
  const apiKey = process.env.TRIPADVISORAPI;

  const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${apiKey}&language=en&currency=USD`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  const response = await fetch(url, options);
  const jsonData = await response.json();

  const accommodationDetail = [];

  const existingAccommodation = await AccommodationDetail.findOne({
    locationId,
  });
  if (!existingAccommodation) {
    accommodationDetail.push({
      locationId,
      name: jsonData.name,
      webURL: jsonData.web_url,
      city: jsonData.address_obj.city,
      address: jsonData.address_obj.address_string,
      long: jsonData.longitude,
      lat: jsonData.latitude,
      rating: jsonData.rating,
      reviewsNo: jsonData.num_reviews,
      amenities: jsonData.amenities,
    });
  }

  if (accommodationDetail.length > 0) {
    await AccommodationDetail.insertMany(accommodationDetail);
    console.log("Added");
  }

  res.json(jsonData);
};

exports.getAccommodationPhotos = async (req, res) => {
  const locationId = "21372643";
  const apiKey = process.env.TRIPADVISORAPI;
  const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${apiKey}&language=en&limit=5`;
  const options = { method: "GET", headers: { accept: "application/json" } };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
};
