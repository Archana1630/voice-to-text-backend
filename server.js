// After receiving file

console.log(
"Received file:",
req.file.originalname
);

// Debug logs
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
