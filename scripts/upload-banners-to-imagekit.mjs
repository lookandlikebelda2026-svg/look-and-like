import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
for (const rawLine of envText.split('\n')) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx !== -1) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    env[key] = val;
  }
}

const publicKey = env.VITE_IMAGEKIT_PUBLIC_KEY;
const privateKey = env.VITE_IMAGEKIT_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  console.error('Missing ImageKit keys in .env. Found keys:', Object.keys(env));
  process.exit(1);
}

function generateAuth() {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800;
  const hmac = crypto.createHmac('sha1', privateKey);
  hmac.update(token + expire);
  const signature = hmac.digest('hex');
  return { token, expire, signature };
}

async function uploadFile(filePath, targetFolder, targetFileName) {
  console.log(`Uploading ${filePath} -> ${targetFolder}/${targetFileName}...`);
  const fileBuffer = fs.readFileSync(filePath);
  const { token, expire, signature } = generateAuth();

  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob, targetFileName);
  formData.append('fileName', targetFileName);
  formData.append('publicKey', publicKey);
  formData.append('signature', signature);
  formData.append('expire', expire.toString());
  formData.append('token', token);
  formData.append('useUniqueFileName', 'false');
  formData.append('folder', targetFolder);

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Upload failed for ${filePath}: ${JSON.stringify(json)}`);
  }
  console.log(`Success: ${json.url}`);
  return json;
}

async function run() {
  const results = {};

  results.hero = await uploadFile('src/asset/Hero.png', '/banners', 'hero-banner.png');
  results.cta = await uploadFile('src/asset/cta-banner.jpg', '/banners', 'cta-banner.jpg');
  results.founder1 = await uploadFile('src/asset/founder/shiuli-award-dev.jpg', '/founder', 'shiuli-award-dev.jpg');
  results.founder2 = await uploadFile('src/asset/founder/shiuli-portrait-red.jpg', '/founder', 'shiuli-portrait-red.jpg');
  results.founder3 = await uploadFile('src/asset/founder/shiuli-award-koel.jpg', '/founder', 'shiuli-award-koel.jpg');
  results.founder4 = await uploadFile('src/asset/founder/shiuli-event-aflairza.jpg', '/founder', 'shiuli-event-aflairza.jpg');
  results.founder5 = await uploadFile('src/asset/founder/shiuli-award-glam2025.jpg', '/founder', 'shiuli-award-glam2025.jpg');

  fs.writeFileSync('scripts/uploaded-urls.json', JSON.stringify(results, null, 2));
  console.log('All files uploaded successfully!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
