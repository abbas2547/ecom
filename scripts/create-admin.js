const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = 'abbaszaidi028@gmail.com';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable. Set it and re-run.');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('zyrox');

    const now = new Date();
    const result = await db.collection('users').updateOne(
      { email: EMAIL },
      {
        $set: { role: 'admin', updatedAt: now, email: EMAIL },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    if (result.upsertedId) {
      console.log(`Created new admin user: ${EMAIL}`);
    } else if (result.modifiedCount > 0) {
      console.log(`Updated existing user to admin: ${EMAIL}`);
    } else {
      console.log(`User already has admin role or no change needed: ${EMAIL}`);
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
