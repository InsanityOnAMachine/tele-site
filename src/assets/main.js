let NAME = null
let last_pos = null

let last_name = null
let last_coords = null

// https://stackoverflow.com/questions/61336948/calculating-the-cardinal-direction-of-a-smartphone-with-js
var heading = 0

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

async function setLocation(coords) {
  last_pos = coords

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
}

function setError(e) {
  document.getElementById("errors").textContent = Date.now() + error.message
}

function setAccuracy(a) {

}


function submitLoop() {
const geoId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLocation(position.coords);
      setAccuracy(position.coords.accuracy);
      console.log({ lat, lng }, position.coords.accuracy);
      // if (position.coords.accuracy > 10) {
      //   showErrorSnackBar("The GPS accuracy isn't good enough");
      // }
    },
    (e) => {
      setError(e.message);
    },
    { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
  )
}

function updateInfo() {
  let nambox = document.getElementById("nearest")
  let arrow = document.getElementById("arrow");
  let north = document.getElementById("north");

  if (last_name == null) {
    nambox.textContent = "Nobody near you!"
  } else {
    // https://github.com/theGreski/AzimuthJS
    let info = azimuth({lat: last_pos.latitude, lng: last_pos.longitude}, {lat: last_coords.latitude, lng: last_coords.longitude}, {units: "ft"})
    
    nambox.textContent = last_name + " is " + info.distance + " feet away!"
    arrow.style.transform = "rotate(" + (info.bearing - heading) + "deg)"
    north.style.transform = "rotate(" + (heading) + "deg)"
  }
}

setInterval(updateInfo, 100)

const handleOrientation = (event) => {
    document.getElementById("arrownotes").textContent = event.alpha
    setError(event + " " + event.alpha)
    if(event.webkitCompassHeading) {
        // some devices don't understand "alpha" (especially IOS devices)
        heading = event.webkitCompassHeading;
    }
    else{
        heading = event.alpha;//compassHeading(event.alpha, event.beta, event.gamma);
    }
};

const compassHeading = (alpha, beta, gamma) => {

    // Convert degrees to radians
    const alphaRad = alpha * (Math.PI / 180);
    const betaRad = beta * (Math.PI / 180);
    const gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    const cA = Math.cos(alphaRad);
    const sA = Math.sin(alphaRad);
    const cB = Math.cos(betaRad);
    const sB = Math.sin(betaRad);
    const cG = Math.cos(gammaRad);
    const sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    const rA = - cA * sG - sA * sB * cG;
    const rB = - sA * sG + cA * sB * cG;
    const rC = - cB * cG;

    // Calculate compass heading
    let compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if(rB < 0) {
        compassHeading += Math.PI;
    }else if(rA < 0) {
        compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
};

function reqqq() {

  // https://stackoverflow.com/questions/61145076/devicemotionevent-requestpermission-throws-notallowederror
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener("deviceorientation", handleOrientation);
          document.getElementById("arrownotes").textContent += "permission granted!"
        } else {
          document.getElementById("arrownotes").textContent += "permission not granted!"
        }
      })
      .catch(() => document.getElementById("arrownotes").textContent += "calling function error!");
  } else {
    document.getElementById("arrownotes").textContent += "not a function error!"
  }

}
// const id = navigator.geolocation.watchPosition(successCallback, errorCallback);

// while (true) {
//   navigator.geolocation.getCurrentPosition(successCallback. errorCallback)
// }