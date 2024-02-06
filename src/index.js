const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const https = require('https');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')
app.use(express.static("public"))

app.get('/', (req, res) =>{
    res.render('login')
})
app.get('home', (req, res) =>{
    res.render('home')
})
app.get('/login', (req, res) =>{
    res.render('login')
})

app.get('/signup', (req, res) =>{
    res.render('signup')
})

app.post('/signup', async (req, res) =>{
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({name: data.name})
    if(existingUser) {
        res.send("User already exists. Please choose a new one")
    }else{
        const salt = 10;
        const hash = await bcrypt.hash(data.password,salt)

        data.password = hash
        const userData = await collection.insertMany(data)
        console.log(userData)
        res.render('login')
       
    }
})  

app.post('/login', async (req, res) => {
    try{
        const check = await collection.findOne({name:req.body.username});
        if(!check){
            res.send("user name cannot find ")
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if(isPasswordMatch){
          res.render('home')
        }else{
            req.send("wrong password")
        }

    }catch(e){
        console.log(e)
    }
})


const api = "16d311977fced07064aa910221a6b04c" 

app.post('/weather', (req, res) => {
    const city = req.body.city; 
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=metric"; 
    https.get(url, (response) => { 
        response.on("data", (data) => { 
            const weatherData = JSON.parse(data); 
            const temp = weatherData.main.temp; 
            const description = weatherData.weather[0].description; 
            const icon = weatherData.weather[0].icon; 
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"; 
            console.log(weatherData); 
            
            // Send HTML response with added styles
            res.write("<!DOCTYPE html><html><head><title>Weather</title>");
            res.write("<style>body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; }");
            res.write("h2 { color: #333; margin-bottom: 10px; }");
            res.write("p { color: #555; margin-bottom: 20px; }");
            res.write("img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }");
            res.write("button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }");
            res.write("button:hover { background-color: #45a049; }");
            res.write("</style>");
            res.write("</head><body>");
            
            // Display weather information with styling
            res.write("<h1>Temperature is " + temp + "&#8451</h1>"); 
            res.write("<h2>Weather is " + description + "</h2>"); 
            res.write("<img src='" + imageURL + "'><br>"); 
            
            // Add a button to go back to the form
            res.write("<button onclick='window.history.back()'>Go Back</button>");
            
            // End HTML response
            res.write("</body></html>");
            res.send();
        }); 
    }); 
});


const port = 3000;
app.listen(port,()=>{
    console.log('listening on port')
});