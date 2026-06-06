const https = require('https');
https.get("https://image.pollinations.ai/prompt/dog?nologo=true", (res) => {
  console.log("STATUS: ", res.statusCode);
  res.on('data', () => {});
  res.on('end', () => console.log('done'));
}).on('error', (e) => console.error(e));
