const express = require("express");
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/assets/index.html")
})

app.get('/js', (req, res) => {
  res.sendFile(__dirname + "/assets/main.js")
})

geo_data = {}

app.post('/name', (req, res) => {
  console.log("name req rec'd ", req.body)
  geo_data[req.body.text_inp] = req.body.geo
  res.status(200).send();
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Site listening on port ${PORT}`);
})