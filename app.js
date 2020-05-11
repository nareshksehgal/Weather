const express = require("express");

const https =  require("https");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html");
});

//  https://openweathermap.org/weather-conditions
app.post("/", function(req, res){
  query = req.body.myCityName;
  const apiKey = "4f6e4dbf5ae96ffc416d5c7abc4a258b";
  const units = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID="+apiKey+"&q="+query+"&units="+units;

//https.get(url[, options][, callback])
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){
      const weatherData = JSON.parse(data);

      //opposite of parse is JSON.stringify(data); to flatten it.
      const temp = weatherData.list[0].main.temp;
      const weatherDes = weatherData.list[0].weather[0].description;
      const icon = weatherData.list[0].weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

  //only 1 send allowed per function(), so do a bunch of writes before sending.
      res.write("<h1>The temperature in "+ query +" is = "+temp+" degree Fehren.</h1>");
      res.write("<h2>Weather Description in "+query+ " is = " + weatherDes + "</h2>");
      res.write("<img src="+imageURL+">");
      res.send();
      });
    });
});

app.listen(3000, function(){
  console.log("My weather server is running on port 3000.");
});
