const https = require('https');
const fullPrompt = "Professional e-commerce studio photography of a premium bottle or can of Lait beverage, clean white background, 3/4 angle, subtle soft shadow, studio lighting, highly detailed, 4k resolution, white background, standalone product. No people, no distractions.";
const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=800&height=800&seed=123456`;
https.get(url, (res) => {
  console.log("STATUS: ", res.statusCode);
  res.on('data', () => {});
  res.on('end', () => console.log('done'));
}).on('error', (e) => console.error(e));
