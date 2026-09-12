let NAME = null
let last_pos = null

let last_name = null
let last_coords = null

const successCallback = async (position) => {
  console.log(position.coords)
  last_pos = position.coords;

  if (NAME == null || last_pos == null) {document.getElementById("errors").textContent = Date.now() + " name or last pos is null"; return}
  // https://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-specific-property-in-javascript
  // https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
  if (! ("latitude" in last_pos)) {document.getElementById("errors").textContent = Date.now() + " no latitude; you sent no data"; return;}

  let res = await (await fetch("./name",
    {
    method: "POST",
        body: JSON
        .stringify
        ({
          text_inpt: NAME,
          geo: last_pos
        }),
        headers: {
          "Content-type": "application/json",
        },
    })).json()
  
  if (res == null) {
    last_name = null
    last_coords = null
  } else {
    last_name = res.nam
    last_coords = res.pos
  }

  document.getElementById("errors").textContent = Date.now() + " Sent data!"
};

const errorCallback = (error) => {
  console.log(error);
  document.getElementById("errors").textContent = Date.now() + " " + error.message
};

async function submitName() {
  text = document.getElementById("name").value
  console.log(text)
  NAME = text
  submitLoop()
}

const submit = async () => {
  // https://www.freecodecamp.org/news/how-to-get-user-location-with-javascript-geolocation-api
  const options = {
    enableHighAccuracy: true,
    maximumAge: 5000
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)
}

function submitLoop() {
  submit()
  setInterval(submit, 8000)
}

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

function updateInfo() {
  let nambox = document.getElementById("nearest")

  if (last_name == null) {
    nambox.textContent = "Nobody near you!"
  } else {
    nambox.textContent = last_name + " is " + getDistanceFromLatLonInFeet(last_pos.latitude, last_pos.longitude, last_coords.latitude, last_coords.longitude) + " feet away!"
  }
}

setInterval(updateInfo, 200)

// const id = navigator.geolocation.watchPosition(successCallback, errorCallback);

// while (true) {
//   navigator.geolocation.getCurrentPosition(successCallback. errorCallback)
// }