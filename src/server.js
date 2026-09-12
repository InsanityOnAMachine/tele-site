const express = require("express");
const app = express();

// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceFromLatLonInFeet(lat1, lon1, lat2, lon2) {
  var R = 6371 * 1000 * 3; // Radius of the earth in feet
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in feet
  return d || 0;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

app.use(express.static(__dirname))
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/assets/index.html")
})

app.get('/js', (req, res) => {
  res.sendFile(__dirname + "/assets/main.js")
})

let geo_data = Object();

app.post('/name', (req, res) => {
  console.log("name req rec'd ", req.body)
  // https://www.geeksforgeeks.org/javascript/how-to-check-an-object-is-empty-using-javascript/
  if (Object.keys(req.body.geo).length === 0) {geo_data[req.body.text_inpt] = req.body.geo}
  if (!req.body.text_inpt in geo_data) {return}

  let nearest_key = null

  console.log(geo_data)

  for (let key of Object.keys(geo_data)) {
    if (key == req.body.text_inpt) {continue}
    if (nearest_key == null || getDistanceFromLatLonInFeet(
      geo_data[key].latitude, geo_data[key].longitude,
      req.body.geo.latitude, req.body.geo.longitude
    ) < getDistanceFromLatLonInFeet(
      geo_data[nearest_key].latitude, geo_data[nearest_key].longitude,
      req.body.geo.latitude, req.body.geo.longitude
    )) {
      nearest_key = key
    }
  }
  res.status(200).json(nearest_key == null? null : {nam: nearest_key, pos: geo_data[nearest_key]});
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Site listening on port ${PORT}`);
})