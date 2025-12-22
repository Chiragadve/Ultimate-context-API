import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { enrichContext } from './services/orchestrator';
import { RateLimiter } from './services/rate-limiter';
import { filterResponse } from './utils/response';
import { swaggerSpec } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
    const ip = (req.query.ip as string) || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const apiKey = (req.query.key as string) || (req.headers['x-api-key'] as string) || '';
    const userAgent = req.headers['user-agent'] || '';

    // Enforce Mandatory API Key
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: API Key Required' });
    }

    // Rate Limit Check
    const limitResult = await RateLimiter.check(ip, apiKey);

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
        const data = await enrichContext(ip, userAgent, apiKey);

        // Add User's Key and IP validation note if requested via query
        if (req.query.debug) {
            console.log(`Processing request for IP: ${ip} with Key: ${apiKey}`);
        }

        // Field Selection
        if (req.query.fields) {
            const filtered = filterResponse(data, req.query.fields as string);
            return res.json(filtered);
        }

        return res.json(data);
    } catch (error: any) {
        console.error('Enrichment Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Backend API Engine running on http://localhost:${PORT}`);
        console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
}

export default app;
