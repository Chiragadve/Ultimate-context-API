# Ultimate Context API Library

[![NPM version](https://img.shields.io/npm/v/ultimate-context.svg)](https://npmjs.org/package/ultimate-context)

The Ultimate Context API library provides convenient access to the Ultimate Context REST API from TypeScript or JavaScript.

It is designed to give you instant, enriched context for any IP address, including location, weather, currency, security, and holiday data.

To learn how to use the Ultimate Context API, check out our [API Reference and Documentation](http://localhost:3000/docs).

## Installation

```bash
npm install ultimate-context
```

## Usage

The primary API for interacting with the Ultimate Context service is the `enrich` method. You can retrieve full context for an IP address with the code below.

```typescript
import { UltimateContext } from 'ultimate-context';

const client = new UltimateContext({
  apiKey: process.env['ULTIMATE_CONTEXT_API_KEY'], // This is the default and can be omitted
});

async function main() {
  const response = await client.enrich({
    ip: '8.8.8.8', // Optional: defaults to the requester's IP
  });

  console.log(response.location.city); // 'Mountain View'
  console.log(response.context.weather.temp_c); // 22.5
}

main();
```

### Field Selection

You can optimize your response by requesting only specific fields.

```typescript
const response = await client.enrich({
  ip: '1.1.1.1',
  fields: ['location', 'context.currency']
});
```

### Debug Mode

Include debug information in the response headers and logs if you are troubleshooting rate limits or keys.

```typescript
const response = await client.enrich({
  debug: true
});
```

## Configuration

The client can be configured with the following options:

| Option | Type | Description |
| --- | --- | --- |
| `apiKey` | `string` | Your API Key. Defaults to `process.env['ULTIMATE_CONTEXT_API_KEY']`. |
| `baseURL` | `string` | Base URL for the API. Defaults to `https://ultimatecontextapi.vercel.app/v1`. |

## Error Handling

When the library is unable to connect to the API, or if the API returns a non-success status code (i.e., 4xx or 5xx response), an Error will be thrown with the status code and message.

```typescript
try {
  await client.enrich();
} catch (error) {
    console.error(error.message); // "UltimateContext API Error: 401 Unauthorized..."
}
```

## Requirements

TypeScript >= 4.5 is supported.

The following runtimes are supported:
- Node.js 18 LTS or later.
- Bun 1.0 or later.
- Deno v1.28.0 or higher.

## License

MIT
