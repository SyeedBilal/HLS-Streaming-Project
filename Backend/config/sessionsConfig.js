const session = require('express-session');
const {RedisStore} = require('connect-redis');
const { createClient } = require('redis');
require('dotenv');

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    tls: true // Add this if using TLS/SSL connection
  }
});

// Error handling
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis client ready to use');
});

redisClient.on('end', () => {
  console.log('Redis client disconnected');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

// Create session configuration
const sessionConfig = session({
  secret: process.env.SESSION_SECRET_KEY,
  store: new RedisStore({ 
    client: redisClient,
    ttl: 86400, // 1 day in seconds
    disableTouch: false
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 86400000, // 1 day in milliseconds
    sameSite: 'lax'
  }
});

// Add a health check middleware
sessionConfig.healthCheck = async (req, res, next) => {
  try {
    await redisClient.ping();
    next();
  } catch (err) {
    console.error('Redis health check failed:', err);
    res.status(500).send('Session service unavailable');
  }
};

module.exports = sessionConfig;