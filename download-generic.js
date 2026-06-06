const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'products', 'generic');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const images = {
  // A stack of sacks/bags
  'sac': 'https://images.unsplash.com/photo-1622484211148-52fb16fbb7ae?w=800&q=80',
  // A cardboard box / carton
  'carton': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
  // A pack of bottles/cans
  'pack': 'https://images.unsplash.com/photo-1606842727653-f725a3962649?w=800&q=80',
  // A generic bottle
  'bouteille': 'https://images.unsplash.com/photo-1600645065099-2d2d99d36eec?w=800&q=80',
  // A tin can / boîte
  'boite': 'https://images.unsplash.com/photo-1556911073-a517e752729c?w=800&q=80',
  // A generic premium abstract shape for "Unité" or unknown
  'unite': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const [key, url] of Object.entries(images)) {
    const dest = path.join(dir, `${key}.jpg`);
    console.log(`Downloading ${key}...`);
    try {
      await download(url, dest);
      console.log(`Saved ${key}`);
    } catch (e) {
      console.error(`Error downloading ${key}`, e);
    }
  }
}

run();
