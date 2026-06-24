const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");

require("dotenv").config();
console.log("Restart test");

console.log("=== STARTUP ENV CHECK ===");
console.log("PORT:", process.env.PORT);
console.log("HAS SARVAM KEY:", !!process.env.SARVAM_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
dest: "uploads/"
});

app.get("/", (req, res) => {
res.send("Backend is running");
});

app.get("/test", (req, res) => {

console.log("TEST REQUEST RECEIVED");

res.json({
message: "Backend Connected Successfully"
});

});

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
      error: "No audio file received"
    });

  }

  console.log(
    "Received file:",
    req.file.originalname
  );

  console.log(
    "SARVAM_API_KEY value:",
    process.env.SARVAM_API_KEY
  );

  console.log(
    "API KEY EXISTS:",
    !!process.env.SARVAM_API_KEY
  );

  if (!process.env.SARVAM_API_KEY) {

    return res.status(500).json({
      error: "SARVAM API KEY missing"
    });

  }

  const formData = new FormData();

  formData.append(
    "file",
    fs.createReadStream(req.file.path)
  );

  console.log(
    "Sending audio to Sarvam..."
  );

  const response = await axios.post(
    "https://api.sarvam.ai/speech-to-text",
    formData,
    {
      headers: {
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

  if (
    req.file.path &&
    fs.existsSync(req.file.path)
  ) {
    fs.unlinkSync(req.file.path);
  }

  res.json({
    transcript:
      response.data.transcript || ""
  });

} catch (error) {

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

const PORT = process.env.PORT || 5000;


app.get("/env-check", (req, res) => {
  res.json({
    hasKey: !!process.env.SARVAM_API_KEY,
  });
});
app.listen(PORT, () => {

console.log(
`Server running on port ${PORT}`
);

});
