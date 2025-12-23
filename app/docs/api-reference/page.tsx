
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
                    <Badge variant="outline" className="border-primary text-primary">Base URL: https://ultimate-context-api.vercel.app/v1</Badge>
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
                <h2 className="text-3xl font-bold mb-8">Data Segments & Endpoints</h2>
                <p className="text-muted-foreground mb-8">
                    The API returns data in "segments". You can request specific segments using the <code>fields</code> parameter to reduce latency and response size.
                </p>

                <div className="space-y-16">

                    {/* 1. Core Location */}
                    <div id="location" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Core</Badge>
                            <h3 className="text-2xl font-bold">IP & Location</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Precise geolocation data including city, country, coordinates, and ISP information.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-2">Available Fields</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex gap-2"><span className="text-primary">ip</span> Request IP address</li>
                                    <li className="flex gap-2"><span className="text-primary">location.city</span> City name</li>
                                    <li className="flex gap-2"><span className="text-primary">location.country</span> Country name</li>
                                    <li className="flex gap-2"><span className="text-primary">location.timezone</span> Timezone ID</li>
                                    <li className="flex gap-2"><span className="text-primary">location.coordinates</span> Lat/Lon object</li>
                                    <li className="flex gap-2"><span className="text-primary">location.isp</span> Internet Service Provider</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto">
                                <div className="text-muted-foreground mb-2 select-none"># Request Format</div>
                                <pre className="text-blue-400">
                                    {`GET /v1/enrich?fields=location.city,location.country,location.coordinates

// Response
{
  "location": {
    "city": "Mountain View",
    "country": "United States",
    "coordinates": {
      "lat": 37.386,
      "lon": -122.083
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 2. Weather */}
                    <div id="weather" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Context</Badge>
                            <h3 className="text-2xl font-bold">Weather</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Real-time weather conditions for the IP's location.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-2">Available Fields</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex gap-2"><span className="text-primary">context.weather.temp_c</span> Temperature (Celsius)</li>
                                    <li className="flex gap-2"><span className="text-primary">context.weather.condition</span> Condition text</li>
                                    <li className="flex gap-2"><span className="text-primary">context.weather.humidity</span> Humidity %</li>
                                    <li className="flex gap-2"><span className="text-primary">context.weather.wind_kph</span> Wind speed</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto">
                                <pre className="text-yellow-400">
                                    {`GET /v1/enrich?fields=context.weather

// Response
{
  "context": {
    "weather": {
      "temp_c": 22.5,
      "condition": "Partly cloudy",
      "humidity": 45
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 3. Currency */}
                    <div id="currency" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Context</Badge>
                            <h3 className="text-2xl font-bold">Currency</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Local currency information associated with the location.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-2">Available Fields</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex gap-2"><span className="text-primary">context.currency.code</span> ISO 4217 Code (e.g. USD)</li>
                                    <li className="flex gap-2"><span className="text-primary">context.currency.rate</span> Exchange rate to USD</li>
                                    <li className="flex gap-2"><span className="text-primary">context.currency.symbol</span> Currency symbol</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto">
                                <pre className="text-green-400">
                                    {`GET /v1/enrich?fields=context.currency

// Response
{
  "context": {
    "currency": {
      "code": "EUR",
      "rate": 0.92,
      "symbol": "€"
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 4. Holidays */}
                    <div id="holidays" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">Context</Badge>
                            <h3 className="text-2xl font-bold">Holidays</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Public holiday information for the location.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-2">Available Fields</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex gap-2"><span className="text-primary">context.holidays.is_holiday</span> Boolean status</li>
                                    <li className="flex gap-2"><span className="text-primary">context.holidays.holiday_name</span> Name of holiday</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto">
                                <pre className="text-pink-400">
                                    {`GET /v1/enrich?fields=context.holidays

// Response
{
  "context": {
    "holidays": {
      "is_holiday": true,
      "holiday_name": "Christmas Day"
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 5. Security */}
                    <div id="security" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Context</Badge>
                            <h3 className="text-2xl font-bold">Security</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Risk analysis and security context for the IP address.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-2">Available Fields</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex gap-2"><span className="text-primary">context.security.is_proxy</span> Proxy detection</li>
                                    <li className="flex gap-2"><span className="text-primary">context.security.is_tor</span> Tor code detection</li>
                                    <li className="flex gap-2"><span className="text-primary">context.security.risk_score</span> 0-100 Risk Score</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto">
                                <pre className="text-red-400">
                                    {`GET /v1/enrich?fields=context.security

// Response
{
  "context": {
    "security": {
      "is_proxy": true,
      "is_tor": false,
      "risk_score": 85
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 6. Device */}
                    <div id="device" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Context</Badge>
                            <h3 className="text-2xl font-bold">Device</h3>
                        </div>
                        <p className="text-muted-foreground">
                            User agent analysis to determine device type and OS.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-2">Available Fields</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex gap-2"><span className="text-primary">context.device.type</span> 'mobile' | 'desktop'</li>
                                    <li className="flex gap-2"><span className="text-primary">context.device.os</span> Operating System</li>
                                    <li className="flex gap-2"><span className="text-primary">context.device.browser</span> Browser Name</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-xs overflow-x-auto">
                                <pre className="text-purple-400">
                                    {`GET /v1/enrich?fields=context.device

// Response
{
  "context": {
    "device": {
      "type": "desktop",
      "os": "Windows",
      "browser": "Chrome"
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
