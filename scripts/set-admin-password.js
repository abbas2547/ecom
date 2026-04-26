const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = 'abbaszaidi028@gmail.com';
const NEW_PASSWORD = process.argv[2] || process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable.');
  process.exit(1);
}

if (!NEW_PASSWORD) {
  console.error('Provide the new password as the first argument or set ADMIN_PASSWORD env var.');
  console.error('Example: node scripts/set-admin-password.js MyS3cretP@ss');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('zyrox');
    const hash = await bcrypt.hash(NEW_PASSWORD, 10);

    const result = await db.collection('users').updateOne(
      { email: EMAIL },
      { $set: { passwordHash: hash, role: 'admin', updatedAt: new Date() }, $setOnInsert: { createdAt: new Date(), email: EMAIL } },
      { upsert: true }
    );

    if (result.upsertedId) console.log('Created admin user and set password for', EMAIL);
    else console.log('Set password for existing user', EMAIL);
  } catch (err) {
    console.error('Error setting admin password:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
