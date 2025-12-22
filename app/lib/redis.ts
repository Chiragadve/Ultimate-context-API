import Redis from 'ioredis';

const getRedisClient = () => {
  // Hardcoded for reliability
  const redisUrl = 'redis://default:SNn8fbsmSk9MrruxDbNnmFh4mPj2jrJX@redis-17655.c61.us-east-1-3.ec2.cloud.redislabs.com:17655';

  if (!redisUrl) {
    console.warn('REDIS_URL missing');
    return null;
  }

  console.log('Initializing Redis client...');
  const client = new Redis(redisUrl);

  client.on('connect', () => {
    console.log('Redis Client Connected Successfully');
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  return client;
};

const redis = getRedisClient();

export default redis;
