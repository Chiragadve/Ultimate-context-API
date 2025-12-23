"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const REDIS_URL = process.env.REDIS_URL || 'redis://default:SNn8fbsmSk9MrruxDbNnmFh4mPj2jrJX@redis-17655.c61.us-east-1-3.ec2.cloud.redislabs.com:17655';
console.log('Connecting to Redis at:', REDIS_URL);
exports.redis = new ioredis_1.default(REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
exports.redis.on('connect', () => {
    console.log('Backend Redis Client Connected Successfully');
});
exports.redis.on('error', (err) => {
    console.error('Backend Redis Connection Error:', err);
});
