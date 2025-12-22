
import { redis } from './src/services/redis';

async function flush() {
    console.log('Flushing Redis...');
    await redis.flushall();
    console.log('Redis Flushed!');
    process.exit(0);
}

flush();
