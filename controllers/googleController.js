const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client();

exports.calculate = async (req, res) => {
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
};

exports.getNearby = async (req, res) => {
  const longLat = "6.9497%2C80.7891";

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=places+to+visit&location=${longLat}&radius=1500&type=tourist_attraction&key=${process.env.GOOGLEAPI}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
};
