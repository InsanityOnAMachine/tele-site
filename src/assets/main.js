let lat_list = []
let long_list = []

let last_pos = 0

let last_name = null
let last_coords = null

const successCallback = (position) => {
  // lat_list.push(position.coords.latitude)
  // long_list.push(position.coords.longitude)
  console.log(position.coords)
  last_pos = position.coords;
  // redraw()
};

const errorCallback = (error) => {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback)

async function submitName() {
  let text = document.getElementById("name").value
  console.log(text)
  trueSubmit(text)
  console.log(text)
}

const submit = async (nam) => {
  // https://www.freecodecamp.org/news/how-to-get-user-location-with-javascript-geolocation-api
  const options = {
    enableHighAccuracy: true,
    timeout: 4000,
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)
  let res = await (await fetch("./name",
    {
    method: "POST",
        body: JSON
        .stringify
        ({
          text_inpt: nam,
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
}

function submitLoop(nam) {
  submit(nam)
  setInterval(submit, 3000, nam)
}

function trueSubmit(word) {
  submitLoop(word)
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
  return d;
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