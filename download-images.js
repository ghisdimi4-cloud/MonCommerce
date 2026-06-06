const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const images = {
  "coca-cola.jpg": "https://m.media-amazon.com/images/I/61vPea7j-yL._AC_SL1500_.jpg",
  "farine.jpg": "https://m.media-amazon.com/images/I/61Z6Pj4pM4L._AC_SL1000_.jpg",
  "riz.jpg": "https://m.media-amazon.com/images/I/61r59A+b3XL._AC_SL1000_.jpg",
  "sucre.jpg": "https://m.media-amazon.com/images/I/71rB2i+XzXL._AC_SL1500_.jpg",
  "tomate.jpg": "https://m.media-amazon.com/images/I/71X8k75CbdL._AC_SL1500_.jpg",
  "vin.jpg": "https://m.media-amazon.com/images/I/61-v8aL830L._AC_SL1500_.jpg"
};

for (const [filename, url] of Object.entries(images)) {
  const filepath = path.join(dir, filename);
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
      });
    } else {
      console.log(`Failed to download ${filename}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.log(`Error downloading ${filename}: ${err.message}`);
  });
}
