import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClient> | null = null;

function getMongoClientPromise() {
  if (!clientPromise) {
    if (!uri) {
      throw new Error(
        "Missing required environment variable MONGODB_URI. Add it to .env.local and your Vercel environment settings."
      );
    }

    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export function connectToDatabase() {
  return getMongoClientPromise();
}
