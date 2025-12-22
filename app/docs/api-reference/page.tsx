
import { Badge } from "@/components/ui/badge";

export default function ApiReferencePage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6">
                    API Reference
                </h1>
                <p className="text-xl text-muted-foreground">
                    Comprehensive reference for the Ultimate Context API.
                </p>
                <div className="mt-4 flex gap-2">
                    <Badge variant="outline" className="border-primary text-primary">Base URL: http://localhost:4000/v1</Badge>
                </div>
            </div>

            {/* Request Structure */}
            <section id="structure">
                <h2 className="text-2xl font-bold mb-4">Request Structure</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                        <p className="text-muted-foreground mb-2">
                            All API requests must be authenticated using the `x-api-key` header.
                        </p>
                        <div className="bg-secondary/10 p-3 rounded-lg border border-border/50 font-mono text-sm max-w-md">
                            x-api-key: sk_12345abcdef...
                        </div>
                    </div>
                </div>
            </section>

            {/* Rate Limiting */}
            <section id="rate-limits">
                <h2 className="text-2xl font-bold mb-4">Rate Limiting</h2>
                <p className="text-muted-foreground mb-4">
                    The API enforces rate limits to ensure fair usage. Limits are based on your plan tier.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-2 font-semibold">Tier</th>
                                <th className="py-2 font-semibold">Limit</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-2">Free</td>
                                <td className="py-2">100 req/min</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2">Pro</td>
                                <td className="py-2">10,000 req/min</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                    Exceeding limits will return a `429 Too Many Requests` status code.
                </p>
            </section>

            <hr className="border-border/50" />

            {/* ENDPOINTS */}
            <section id="endpoints">
                <h2 className="text-3xl font-bold mb-8">Endpoints</h2>

                <div className="space-y-8">
                    {/* GET /enrich */}
                    <div className="glass-card p-6 border border-border rounded-xl">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-mono">GET</Badge>
                            <code className="text-lg font-mono font-semibold">/enrich</code>
                            <span className="text-muted-foreground text-sm">Enrich an IP address with full context.</span>
                        </div>

                        {/* Parameters */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Query Parameters</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-muted-foreground bg-secondary/10">
                                        <tr>
                                            <th className="p-2 rounded-l-lg">Parameter</th>
                                            <th className="p-2">Type</th>
                                            <th className="p-2">Required</th>
                                            <th className="p-2 rounded-r-lg">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-border/10">
                                            <td className="p-2 font-mono text-primary">ip</td>
                                            <td className="p-2">string</td>
                                            <td className="p-2 text-muted-foreground">No</td>
                                            <td className="p-2 text-muted-foreground">The IP address to lookup. Defaults to request IP.</td>
                                        </tr>
                                        <tr className="border-b border-border/10">
                                            <td className="p-2 font-mono text-primary">fields</td>
                                            <td className="p-2">string</td>
                                            <td className="p-2 text-muted-foreground">No</td>
                                            <td className="p-2 text-muted-foreground">Comma-separated list (e.g., `location,context.weather`).</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-mono text-primary">debug</td>
                                            <td className="p-2">boolean</td>
                                            <td className="p-2 text-muted-foreground">No</td>
                                            <td className="p-2 text-muted-foreground">Set to `true` to view debug logs.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Example Response */}
                        <div>
                            <h4 className="font-semibold mb-3">Example Response</h4>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto max-h-[400px]">
                                <pre className="text-green-400">
                                    {`{
  "ip": "8.8.8.8",
  "location": {
    "ip": "8.8.8.8",
    "city": "Mountain View",
    "country": "United States",
    "timezone": "America/Los_Angeles",
    "isp": "Google LLC"
  },
  "context": {
    "weather": {
      "temp_c": 22.5,
      "condition": "Partly cloudy",
      "updated": "2024-12-22T14:00"
    },
    "currency": {
      "code": "USD",
      "rate": 1,
      "symbol": "$"
    },
    "security": {
      "is_proxy": false,
      "is_tor": false,
      "risk_score": 0
    },
    "device": {
       "type": "mobile",
       "os": "iOS"
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
