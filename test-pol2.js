const https = require('https');
const url = "https://image.pollinations.ai/prompt/Professional%20e-commerce%20studio%20photography%20of%20a%20premium%20bottle%20or%20can%20of%20Lait%20beverage,%20clean%20white%20background,%203/4%20angle,%20subtle%20soft%20shadow,%20studio%20lighting,%20highly%20detailed,%204k%20resolution,%20white%20background,%20standalone%20product.%20No%20people,%20no%20distractions.?width=800&height=800&nologo=true&seed=123456";
https.get(url, (res) => {
  console.log("STATUS: ", res.statusCode);
  res.on('data', () => {});
  res.on('end', () => console.log('done'));
}).on('error', (e) => console.error(e));
