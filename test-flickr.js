const https = require('https');
https.get("https://loremflickr.com/800/800/tomato,can", (res) => {
  console.log("STATUS: ", res.statusCode);
  console.log("HEADERS:", res.headers.location);
}).on('error', (e) => console.error(e));
