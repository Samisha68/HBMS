import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Creating new MongoDB connection...')
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .then(() => {
        console.log('Successfully connected to MongoDB')
        return client
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err)
        throw err
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  console.log('Creating new MongoDB connection...')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then(() => {
      console.log('Successfully connected to MongoDB')
      return client
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err)
      throw err
    })
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise 