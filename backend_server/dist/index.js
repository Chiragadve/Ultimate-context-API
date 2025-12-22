"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const orchestrator_1 = require("./services/orchestrator");
const rate_limiter_1 = require("./services/rate-limiter");
const response_1 = require("./utils/response");
const swagger_1 = require("./swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger Docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
/**
 * @swagger
 * /enrich:
 *   get:
 *     summary: Enrich IP address with context
 *     description: Returns location, weather, currency, and security data for a given IP address.
 *     parameters:
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: IP address to enrich (defaults to requester IP)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to return (e.g., location,context.weather)
 *       - in: query
 *         name: debug
 *         schema:
 *           type: boolean
 *         description: Include debug information
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                 location:
 *                   type: object
 *                 context:
 *                   type: object
 *       401:
 *         description: Invalid API Key
 *       429:
 *         description: Rate limit exceeded
 */
app.get('/v1/enrich', async (req, res) => {
    console.log('[API] Received request:', req.url);
    const ip = req.query.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const apiKey = req.query.key || req.headers['x-api-key'] || '';
    const userAgent = req.headers['user-agent'] || '';
    // Rate Limit Check
    const limitResult = await rate_limiter_1.RateLimiter.check(ip, apiKey);
    res.setHeader('X-RateLimit-Limit', limitResult.limit);
    res.setHeader('X-RateLimit-Remaining', limitResult.remaining);
    res.setHeader('X-RateLimit-Reset', limitResult.reset);
    if (!limitResult.success) {
        if (limitResult.error === 'Invalid API Key') {
            return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
        }
        return res.status(429).json({
            error: 'Too Many Requests',
            limit: limitResult.limit,
            retry_after: limitResult.reset - Math.floor(Date.now() / 1000)
        });
    }
    // Process Request
    try {
        const data = await (0, orchestrator_1.enrichContext)(ip, userAgent, apiKey);
        // Add User's Key and IP validation note if requested via query
        if (req.query.debug) {
            console.log(`Processing request for IP: ${ip} with Key: ${apiKey}`);
        }
        // Field Selection
        if (req.query.fields) {
            const filtered = (0, response_1.filterResponse)(data, req.query.fields);
            return res.json(filtered);
        }
        return res.json(data);
    }
    catch (error) {
        console.error('Enrichment Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`Backend API Engine running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
