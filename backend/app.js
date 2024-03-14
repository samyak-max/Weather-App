const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const NodeCache = require('node-cache');
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const cron = require('node-cron'); 
mongoose.connect(process.env.MONGO_URI);
const app = express();
const port = 3000;
const socketPort = 3001;
const City = require('./models/City');
const UserPref = require('./models/UserPreferences');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

const apiKey = process.env.API_KEY;
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
}
const secret = process.env.SECRET;
app.use(cors(corsOptions));
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

cron.schedule('* */1 * * *', async () => {
    const cities = await City.find();
    if (cities) {
        cities.forEach(async (city) => {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.name}`);
            city.current = response.data.current;
            city.location = response.data.location;
            await city.save();
        });
    }
});

cron.schedule('*/10 * * * *', async () => {
    const notifications = await UserPref.find();
    if(notifications){
        notifications.forEach(async (notification) => {
            const weather = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${notification.city}`);
            if(weather.data.current.condition.text === notification.condition){
                console.log(`The weather in ${notification.city} is ${notification.condition}`);
                io.emit('notification', `The weather in ${notification.city} is ${notification.condition}`);
            }
        });
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.uuid = user.uuid;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

io.on('connection', (socket) => {
    console.log('a user connected');
});

http.listen(socketPort, () => {
    console.log(`listening on: ${socketPort}`);
});

app.get('/weather/city', authenticateJWT, async (req, res) => {
    try {
        let city = myCache.get(req.query.q.toLowerCase());
        if (!city) {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${req.query.q}`);
            city = {
                name: req.query.q.toLowerCase(),
                current: response.data.current,
                location: response.data.location,
                uuid: req.uuid
            };
            await City.findOneAndUpdate({ name: city.name }, city, { upsert: true });
            myCache.set(city.name, city);
        }
        res.json(city);
    } catch (error) {
        console.error(error);
        const city = await City.findOne({ name: req.query.q.toLowerCase() });
        if (city) {
            res.json(city);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.get('/weather', authenticateJWT, async (req, res) => {
    try {
        axios.post('https://api.weatherapi.com/v1/current.json?', req, {
            params: {
                key: apiKey,
                q: 'bulk'
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log(response.data);
            response.data.bulk.forEach(async (item) => {
                const city = await City.findOne({ name: item.query.q });
                if (city) {
                    // console.log('City already exists. Updating data...');
                    city.temperature = item.query.current.temp_c;
                    city.condition = item.query.current.condition;
                    city.location = item.query.location;
                    city.customId = item.query.custom_id === "" ? item.query.q : item.query.custom_id;
                    await city.save();
                } else {
                    const newCity = new City({
                        name: item.query.q,
                        temperature: item.query.current.temp_c,
                        condition: item.query.current.condition,
                        location: item.query.location,
                        customId: item.query.custom_id === "" ? item.query.q : item.query.custom_id
                    });
                    await newCity.save();
                }
            });
            res.json(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/city/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findOne({ customId: id });
        const name = city.name;
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${name}`);
        const formattedResponse = {
          customId: req.customId,
          location: response.data.location,
          temperature: response.data.current.temp_c,
          condition: response.data.current.condition,
        };
        res.json(formattedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/city/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { newCustomId } = req.body;
        const city = await City.findOne({ customId: id });
        if (city) {
            city.customId = newCustomId;
            await city.save();
            res.json({ message: 'Custom ID updated successfully' });
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/city/:id', authenticateJWT, async (req, res) => {
    try{
        const { id } = req.params;
        await City.deleteOne({ name: id })
        .then(() => {
            res.json({ message: 'City deleted successfully' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/auth/jwt', (req, res) => {
    const { uuid } = req.body;
    const token = jwt.sign({ uuid }, secret, { expiresIn: '1h' });
    res.json({ token });
  });

app.post('/notification', authenticateJWT, async (req, res) => {
    const { city, condition } = req.body;
    const uuid = req.uuid;
    try {
        const con = await UserPref.findOne({ city: city, condition: condition });
        if(con){
            res.status(400).json({ error: 'Notification already set' });
        }
        else{
            const newCon = new UserPref({
                uuid: uuid,
                city: city,
                condition: condition
            });
            await newCon.save();
        }
        res.json({ message: 'Notification set successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});