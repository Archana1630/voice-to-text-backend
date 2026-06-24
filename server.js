const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");

require("dotenv").config();


const app = express();


// Allow mobile app connection
app.use(cors());

app.use(express.json());



// Store uploaded audio
const upload = multer({
  dest: "uploads/"
});




// Test backend
app.get("/", (req, res) => {

  res.send(
    "Backend is running"
  );

});




// Test mobile APK connection
app.get("/test", (req, res) => {

  console.log("TEST REQUEST RECEIVED");


  res.json({

    message:
    "Backend Connected Successfully"

  });

});





// Speech to Text API

app.post(
  "/speech-to-text",

  upload.single("audio"),


  async (req, res) => {


    console.log("====================");
    console.log("REQUEST RECEIVED");
    console.log("====================");



    try {


      if (!req.file) {


        return res.status(400).json({

          error:
          "No audio file received"

        });


      }



      console.log(
        "Received file:",
        req.file.originalname
      );




      if (!process.env.SARVAM_API_KEY) {


        return res.status(500).json({

          error:
          "SARVAM API KEY missing"

        });


      }





      const formData =
      new FormData();



      formData.append(

        "file",

        fs.createReadStream(
          req.file.path
        )

      );




      console.log(
        "Sending audio to Sarvam..."
      );





      const response =
      await axios.post(


        "https://api.sarvam.ai/speech-to-text",


        formData,


        {

          headers:{


            ...formData.getHeaders(),


            "api-subscription-key":
            process.env.SARVAM_API_KEY


          }


        }


      );






      console.log(
        "Sarvam Response:",
        response.data
      );







      // remove uploaded file

      if(fs.existsSync(req.file.path)){


        fs.unlinkSync(
          req.file.path
        );


      }






      res.json({

        transcript:
        response.data.transcript


      });







    }

    catch(error){


      console.log(
        "ERROR:",
        error.response?.data ||
        error.message
      );



      res.status(500).json({

        error:
        error.response?.data ||
        error.message


      });


    }


  }

);








// IMPORTANT FOR APK CONNECTION

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});