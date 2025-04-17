import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
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
    console.log('Creating new MongoDB client in development mode...')
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .then(client => {
        console.log('MongoDB connected successfully in development mode')
        return client
      })
      .catch(error => {
        console.error('MongoDB connection error in development mode:', error)
        throw error
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  console.log('Creating new MongoDB client in production mode...')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then(client => {
      console.log('MongoDB connected successfully in production mode')
      return client
    })
    .catch(error => {
      console.error('MongoDB connection error in production mode:', error)
      throw error
    })
}

// Add connection event listeners
clientPromise.then((client) => {
  client.on('serverHeartbeatSucceeded', () => {
    console.log('MongoDB heartbeat succeeded')
  })
  
  client.on('serverHeartbeatFailed', (err) => {
    console.error('MongoDB heartbeat failed:', err)
  })
})

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise 