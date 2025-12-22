import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://default:SNn8fbsmSk9MrruxDbNnmFh4mPj2jrJX@redis-17655.c61.us-east-1-3.ec2.cloud.redislabs.com:17655';

console.log('Connecting to Redis at:', REDIS_URL);

export const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on('connect', () => {
    console.log('Backend Redis Client Connected Successfully');
});

redis.on('error', (err) => {
    console.error('Backend Redis Connection Error:', err);
});
