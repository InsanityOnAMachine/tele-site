let lat_list = []
let long_list = []

let last_pos = 0

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

  let nambox = document.getElementById("nearest")
  
  if (res == null) {
    nambox.textContent = "Nobody near you!"
  } else {
    nambox.textContent = res.nam + " is the nearest person to you"
  }
}

function submitLoop(nam) {
  submit(nam)
  setInterval(submit, 3000, nam)
}

function trueSubmit(word) {
  submitLoop(word)
}

// const id = navigator.geolocation.watchPosition(successCallback, errorCallback);

// while (true) {
//   navigator.geolocation.getCurrentPosition(successCallback. errorCallback)
// }