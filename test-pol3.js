const https = require('https');
const url = "https://image.pollinations.ai/prompt/Professional%20e-commerce%20studio%20photography%20of%20a%20premium%20bottle%20or%20can%20of%20Lait%20beverage";
https.get(url, (res) => {
  console.log("STATUS: ", res.statusCode);
  res.on('data', () => {});
  res.on('end', () => console.log('done'));
}).on('error', (e) => console.error(e));
