const GoogleHotel = require("./../models/GoogleHotel");
const Events = require("./../models/Events");
const { json } = require("express");

exports.getHotels = async (req, res) => {
  const { toLocation, toDate, fromDate, budget } = req.query;

  const adults = "2";
  try {
    // console.log(typeof budget);
    const url = `https://serpapi.com/search.json?engine=google_hotels&q=${toLocation}+hotels&check_in_date=${fromDate}&check_out_date=${toDate}&adults=${adults}&currency=USD&gl=lk&hl=en&max_price=${budget}&key=${process.env.SERPAPIKEY}`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(url, options);
    const jsonData = await response.json();

    const googleHotels = [];
    if (jsonData.properties) {
      for (const property of jsonData.properties) {
        const accommodationName = property.name;
        // console.log(accommodationName);
        const existingAccommodation = await GoogleHotel.findOne({
          accommodationName,
        });
        if (!existingAccommodation) {
          googleHotels.push({
            location: jsonData.search_parameters.q.split(" ")[0],
            name: property.name,
            url: property.link,
            long: property.gps_coordinates.longitude,
            lat: property.gps_coordinates.latitude,
            price:
              property.total_rate && property.total_rate.lowest
                ? property.total_rate.lowest
                : 0,
            ratings: property.overall_rating,
            reviews: property.reviews,
            amenities: property.amenities,
            essentialInfo: property.essential_info,
          });
        }
      }
    }

    if (googleHotels.length > 0) {
      await GoogleHotel.insertMany(googleHotels);
    }
    // console.log(jsonData);
    res.json(jsonData);
  } catch (error) {
    console.log(`Error fetching Data: ${error}`);
  }
};

exports.getPlaces = async (req, res) => {
  try {
    const { toLocation } = req.query;
    // console.log(toLocation);
    const location = "ella";
    const url = `https://serpapi.com/search.json?engine=google&q=places+to+visit+in+${toLocation}&key=${process.env.SERPAPIKEY}`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(url, options);
    const jsonData = await response.json();
    res.json(jsonData);
  } catch (error) {
    console.log(error);
  }
};

function getDateDifference(targetDate) {
  const target = new Date(targetDate);

  const now = new Date();

  const difference = target.getTime() - now.getTime();

  const daysDifference = Math.ceil(difference / (1000 * 3600 * 24));

  if (daysDifference == 1) return "tomorrow";
  if (daysDifference <= 7) return "week";
  if (daysDifference <= 14) return "next_week";
  if (daysDifference >= 30) return "month";
  if (daysDifference <= 60) return "next_month";
  return daysDifference;
}

exports.getEvents = async (req, res) => {
  try {
    const { toLocation, fromDate } = req.query;
    const difference = getDateDifference(fromDate);
    console.log(difference);
    const url = `https://serpapi.com/search.json?htichips=date:${difference}&engine=google_events&q=Events+in+${toLocation}&hl=en&gl=lk&api_key=${process.env.SERPAPIKEY}`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(url, options);
    const jsonData = await response.json();

    const events = [];
    console.log(toLocation, fromDate, jsonData);

    // for (const event of jsonData.events_results) {
    //   events.push({
    //     name: event.title,
    //     date: event.date,
    //     address: event.address,
    //     location: event.event_location_map,
    //     description: event.description,
    //     ticket: event.ticket_info,
    //     thumbnail: event.thumbnail,
    //   });
    // }
    // if (events.length > 0) {
    //   await Events.insertMany(events);
    // }
    res.json(jsonData);
  } catch (error) {
    console.log(`Error fetching Data: ${error}`);
  }
};
