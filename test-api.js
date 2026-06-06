const http = require('http');

const data = JSON.stringify({
  productName: 'Lait',
  category: 'Alimentation'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/generate-image',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let output = '';
  res.on('data', (d) => { output += d; });
  res.on('end', () => { console.log(output); });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
