export {}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}
