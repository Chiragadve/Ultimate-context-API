import { NextRequest, NextResponse } from 'next/server';
import { enrichContext } from '@/app/services/orchestrator';
import { RateLimiter } from '@/app/services/rate-limiter';

// export const runtime = 'edge'; // Enable Edge Runtime


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Get IP: validation first
    let ip = searchParams.get('ip');

    // If no IP provided, try to detect from headers
    if (!ip) {
        const forwarded = request.headers.get('x-forwarded-for');
        ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    }

    // Get User Agent
    let ua = searchParams.get('ua') || request.headers.get('user-agent') || '';

    // --- Rate Limiting Start ---
    const apiKey = request.headers.get('x-api-key');
    let limit = 20; // Default: 20 RPM
    let identifier = `ip:${ip}`;

    if (apiKey) {
        // Verify Key
        const isValid = await RateLimiter.isValidKey(apiKey);
        if (isValid) {
            limit = 100; // Auth: 100 RPM
            identifier = `key:${apiKey}`;
        } else {
            return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
        }
    }

    const rateLimit = await RateLimiter.checkLimit(identifier, limit);

    // Set Headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', limit.toString());
    headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    headers.set('X-RateLimit-Reset', rateLimit.resetIn.toString());

    if (!rateLimit.success) {
        return NextResponse.json(
            { error: 'Too Many Requests' },
            { status: 429, headers }
        );
    }
    // --- Rate Limiting End ---

    try {
        const result = await enrichContext(ip, ua);
        // Copy rate limit headers to response
        const response = NextResponse.json(result);
        headers.forEach((v, k) => response.headers.set(k, v));
        return response;
    } catch (error) {
        console.error('Enrichment Handler Error:', error);

        // Determine if it was a Wave 1 failure or general error
        if (error instanceof Error && error.message.includes('Wave 1')) {
            return NextResponse.json(
                { error: 'Primary location service unavailable. Cannot proceed.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
