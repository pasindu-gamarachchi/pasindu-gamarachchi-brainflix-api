
const express = require('express');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const router = require("express").Router();

const VIDEOS_FILE_PATH =  './data/videos.json';
const VIDEOS_DETAILS_FILE_PATH =  './data/video-details.json';


/*
    Read video data from the input file.
    @param {String} filepath to Read JSON data. 
*/
const readVideosfromFile =  (filepath) => {


    let videos = JSON.parse(fs.readFileSync(filepath));
    return videos;

}

/*
    Validate POST Request Body.
    @param {Object} Object to validate 

*/
const validateRequestBody = (requestBody) => {

    
    let validateResults = {"isValid": true, "statusCode": 202, "statusMessage": "Ok"};

    const keysToValidate = ["title", "channel", "image", "description"];

    keysToValidate.forEach(element => {
        const reqBodyItem = requestBody[element];
        console.log(`Validating ${element}, request body item : ${reqBodyItem}`);

        if (!reqBodyItem){
            validateResults.isValid = false;
            validateResults.statusCode = 400;
            validateResults.statusMessage = `Invalid ${element} missing item in request body` ;
            console.log(`Validate results for ${reqBodyItem}, val results : ${validateResults}`);
            return validateResults;
        }
        if (reqBodyItem.trim() ===""){
            validateResults.isValid = false;
            validateResults.statusCode = 400;
            validateResults.statusMessage = `Invalid ${element} caused by an empty string` ;
            console.log(`Validate results for ${reqBodyItem}, val results : ${validateResults}`);
            return validateResults;
        }

    });

    return validateResults;

}
/*
    Update JSON files with the posted data.
    @param {String} filePath ; to main(videos.json) videos JSON file.
    @param {Object} newData  ;  Object with new data

*/
const updateJsonFiles= (filePath, newData) =>{
    const jsonData = readVideosfromFile(filePath);
    newData = { id: uuid(), ...newData};
    updateDetailedJson(newData, VIDEOS_DETAILS_FILE_PATH);

}

/*
    Update detailed JSON file with the posted data.
    @param {Object} videoDataObj  ;  Object with new data, and generated uuid.
    @param {String} filepath ; to detailed(video-details) videos JSON file.


*/
const updateDetailedJson = (videoDataObj, filepath) => {
    const timestamp = Date.now();
    let detailedVideoObj = {
        "id": videoDataObj.id,
        "title": videoDataObj.title,
        "channel": videoDataObj.channel,
        "image": videoDataObj.image,
        "description": videoDataObj.description,
        "views": "0",
        "likes": "0",
        "duration": "4:01",
        "video": "https://project-2-api.herokuapp.com/stream",
        "timestamp": Date.now(),
        "comments": [
        ]
      }
      const detailedJsonData = readVideosfromFile(filepath);
      detailedJsonData.push(detailedVideoObj);
      fs.writeFileSync(filepath, JSON.stringify(detailedJsonData));

}

/*
    get : gets main video data.
    post : posts video data.
*/
router.get("/", (req, res) => {
    try{
        //const filepath = VIDEOS_FILE_PATH;
        let videos = readVideosfromFile(VIDEOS_DETAILS_FILE_PATH);
        let videoData = videos.map((elem) =>{
                return {
                    id : elem.id,
                    title: elem.title,
                    channel: elem.channel,
                    image: elem.image
                }
        }

        )

        res.status(200).json(videoData);

    }
    catch{
        res.status(500).send('Server Error');
    }
    }
).post("/", (req, res)=> {
    const validateRes = validateRequestBody(req.body);
    console.log(`Validate Res Status Code : ${validateRes}`);

    if (validateRes.statusCode !==202){
        const errResp = {isError: true, errMsg : validateRes.statusMessage};
        res.status(validateRes.statusCode).json(errResp);
    }
    else{
        updateJsonFiles(VIDEOS_FILE_PATH, req.body);
        res.status(202).json({"msg": "Video created."}) // TODO : Confirm what the required response is.
    }
    
})

/*
    get : gets detailed video data for the passed in ID.
*/
router.get("/:id", (req, res) => {
    console.log(`Recieved param for video route : ${req.params.id}`);
    let videoDetails = readVideosfromFile(VIDEOS_DETAILS_FILE_PATH);
    let videoObj = videoDetails.find((elem) =>{
        return elem.id ===req.params.id;
    }

    )
    console.log(`Found Video Obj ---> ${videoObj}`);

    if (!videoObj){
        res.status(404).json(
            {
                "isError": true,
                "message": "No video with that id exists"
            }
        )
    }
    res.status(200).json(videoObj);
})

module.exports = router;