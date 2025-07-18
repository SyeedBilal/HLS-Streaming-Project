// Create Redis client using ioredis library
const IORedis = require('ioredis');

REDIS_URL="redis://default:AeRRAAIjcDEzY2M3ZjVlZjE2YTI0NDMyYjA3N2YwMTU4MDNkZDcyNnAxMA@polished-alpaca-58449.upstash.io:6379";

const redisClient = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null, // <-- This is required by BullMQ
  tls:{},
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = redisClient;