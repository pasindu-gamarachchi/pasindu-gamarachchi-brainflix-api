require('dotenv').config();
const express = require('express');
const app = express();
const videoRoutes = require('./routes/videos');


const cors = require('cors');

const PORT = process.env.PORT || 5050;

app.use(express.static('./public'));


app.use((req, res, next) => {
    console.log('Request info: ' + String(req.ip) + ' ' +  String(req.path) +  ' '  + String(req.params) );
    next();
  });


app.use(cors(
    {
        origin: process.env.CLIENT_HOST
    }
))


app.use(express.json())

app.use('/videos', videoRoutes);


app.get('/', (req, res) => {

    res.json({"msg": "hello"}).status(200);
}
)


app.listen(PORT, ()=> {

    console.log(`🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ------------- Server running on ${PORT} ------------ 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀`);
    console.log(`${process.env.CLIENT_HOST}`)
})

