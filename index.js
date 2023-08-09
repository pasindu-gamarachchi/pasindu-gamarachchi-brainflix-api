const express = require('express');
const app = express();
const videoRoutes = require('./routes/videos');


const cors = require('cors');
const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }), ///REMOVE BEFORE SUBMISSION
    ], 
    }
)

const PORT = process.env.PORT || 5050;

app.use((req, res, next) => {
    logger.info('Request info: ' + String(req.ip) + ' ' +  String(req.path) +  ' '  + String(req.params) );
    // console.log('Request info: ' + String(req.ip) + ' ' +  String(req.path) +  ' '  + String(req.params) );
    next();
  });


app.use(cors(
    {
        origin: 'http://localhost:3030'
    }
))



app.use('/videos', videoRoutes);


app.get('/', (req, res) => {

    res.json({"msg": "hello"}).status(200);
}
)


app.listen(PORT, ()=> {

    logger.info(`🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ------------- Server running on ${PORT} ------------ 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀`);
})

