
const express = require('express');
const router = require("express").Router();

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

router.get("/", (req, res) => {
    logger.info("Videos endpoint called.")

    res.send("From Videos");

    }
).post("/", (req, res)=> {
    //TODO : validate request body.
            // Update video data file
            // Return response. 
    logger.info("Post request called with request body ");
    res.status(202).json({"msg": "Video created."})
})

router.get("/:id", (req, res) => {
    logger.info("Videos endpoint with param called.");
    //TODO : Setup video id logic.

})

module.exports = router;