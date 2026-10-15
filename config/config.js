import 'dotenv/config'
const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGODB_URI ||
  process.env.MONGO_HOST ||
  'mongoUri: process.env.MONGODB_URI//' + (process.env.IP || 'localhost') + ':' +
  (process.env.MONGO_PORT || '27017') +
  '/mernproject' ||
      "YOUR_MONGODB_ATLAS_CONNECTION_STRING" ||
      process.env.MONGO_HOST ||
      'mongoUri: process.env.MONGODB_URI//' + (process.env.IP || 'localhost') + ':' +
      (process.env.MONGO_PORT || '27017') +
      '/mernproject'
  }
  
  export default config