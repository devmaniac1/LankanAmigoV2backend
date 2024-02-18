const express = require('express');
const app = express();
const { Client } = require('@googlemaps/google-maps-services-js');
const fetch = require('node-fetch');
const googleMapsClient = new Client();

app.use(express.json());

app.get('/calculate-route', async (req, res) => {

    // const {fromLocation,toLocation,travelMode} = req.query;
    const fromLocation = "Galle, Sri Lanka";
    const toLocation = "Ella, Sri Lanka";
    const apiKey = "AIzaSyBkePZHNAeceiSPlP4LuZIPd28NpBJcaF8"; // Replace with your actual API key
    try {
        const directionsResponse = await googleMapsClient.directions({
            params: {
                origin: fromLocation,
                destination: toLocation,
                mode: "walking",
                key: apiKey
            },
            timeout: 1000,
        });
        console.log(directionsResponse.data)
        res.json(directionsResponse.data);
    } catch (error) {
        console.error('Error calculating route:', error.response.data);
        res.status(500).json({ error: 'Failed to calculate route' });
    }
});

app.get('/get-accomodations',async(req,res) => {
    // const {latLong} = req.query;
    const apiKey = "FDE9409345FD4A24B21D4A6CE6D20369";
    const latLong = "6.8667%2C81.0466"
    const url = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${latLong}&key=FDE9409345FD4A24B21D4A6CE6D20369&category=hotels&radius=3&radiusUnit=km&language=en`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
})

app.get("/get-accomodations-details" ,async(req,res)=>{
    // const {locationId} = req.query;
    const locationId = "19847553";

    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=FDE9409345FD4A24B21D4A6CE6D20369&language=en&currency=USD`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));

})

app.get("/get-accomodations-photo",async(req,res)=>{
    // const {locationId} = req.query;
    const locationId = "19847553";

    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=FDE9409345FD4A24B21D4A6CE6D20369&language=en&limit=5`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});