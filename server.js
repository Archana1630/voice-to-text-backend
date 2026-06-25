const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");

require("dotenv").config();

const app = express();


app.use(cors());

app.use(express.json());


// request logger
app.use((req,res,next)=>{

console.log(
"REQUEST:",
req.method,
req.url
);

next();

});



const upload = multer({

dest:"uploads/"

});





app.get("/",(req,res)=>{

res.send("Backend running");

});





app.get("/test",(req,res)=>{


res.json({

message:"Connected successfully"

});


});








app.post(

"/speech-to-text",

upload.single("audio"),


async(req,res)=>{


let filePath = null;


try{



console.log(
"Speech request received"
);



if(!req.file){


return res.status(400).json({

error:"No audio file received"

});


}



filePath = req.file.path;



console.log(

"Audio file:",

req.file.originalname

);




if(!process.env.SARVAM_API_KEY){


return res.status(500).json({

error:"SARVAM KEY missing"

});


}





const formData = new FormData();




formData.append(

"file",

fs.createReadStream(filePath)

);





console.log(

"Sending to Sarvam..."

);






const response = await axios.post(


"https://api.sarvam.ai/speech-to-text",


formData,


{

headers:{


...formData.getHeaders(),


"api-subscription-key":

process.env.SARVAM_API_KEY


},


timeout:30000


}


);





console.log(

"Sarvam response:",

response.data

);






res.json({

transcript:

response.data.transcript || ""

});






}

catch(error){



console.log(

"Sarvam ERROR:",

error.response?.data ||

error.message

);





res.status(500).json({

error:

error.response?.data ||

error.message


});



}

finally{


if(filePath && fs.existsSync(filePath)){


fs.unlinkSync(filePath);


}


}



}

);






const PORT = 5000;



app.listen(

PORT,

"0.0.0.0",

()=>{


console.log(

`Server running on port ${PORT}`

);


}

);