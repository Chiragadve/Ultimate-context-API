import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ShoppingCart, Globe, ShieldCheck, BarChart3 } from "lucide-react";

export default function DocsIntroduction() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
                    Introduction
                </h1>
                <p className="lead text-xl text-muted-foreground">
                    Welcome to the <strong>Ultimate Context API</strong> documentation. We provide a unified interface for enriching IP addresses with real-time location, weather, currency, and security risk data.
                </p>
            </div>

            <section>
                <h2 className="text-2xl font-bold mb-4">What This API Does</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Building context-aware applications usually requires juggling 5+ different API keys (Location, Weather, Currency, Holidays, Security).
                        </p>
                        <p className="text-muted-foreground">
                            **Ultimate Context** solves this by aggregating these top-tier services into a single, high-performance API call.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        "🌍 Hyper-accurate IP Geolocation (City, ISP)",
                        "☀️ Real-time Weather Conditions & Temp",
                        "💰 Currency Conversion Rates (USD Base)",
                        "🛡️ Security Risk Analysis (TOR, Proxy)",
                        "📅 Public Holidays for the Location",
                        "📱 device Detection (Mobile/Desktop)"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-border/50">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>



            <section>
                <h2 className="text-2xl font-bold mb-6">Who This API Is For</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* E-commerce */}
                    <div className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">E-commerce Platforms</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Boost global conversion rates by localizing the shopping experience instantly. Automatically display prices in the user's local currency (USD, EUR, JPY) and adjust shipping estimates based on real-time public holiday data for their specific region.
                        </p>
                    </div>

                    {/* Content Sites */}
                    <div className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                        <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Media & Content</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Drive engagement with hyper-personalized experiences. greeting users with "Good Morning from [City]" or adapting your UI based on their local weather (e.g., suggesting indoor activities during rain). Make every visitor feel like a local.
                        </p>
                    </div>

                    {/* Security */}
                    <div className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                        <div className="bg-red-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Cybersecurity</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Fortify your application at the edge. Instantly identify and block traffic from high-risk ISPs, TOR exit nodes, and anonymous proxies before they reach your sensitive endpoints. Reduce fraud without adding friction for legitimate users.
                        </p>
                    </div>

                    {/* Analytics */}
                    <div className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                        <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <BarChart3 className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Data & Analytics</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Turn anonymous traffic into actionable insights. Enrich every log entry with precise city-level location, connection type, and device specifics. Understand exactly where your users are coming from to optimize marketing spend and regional strategy.
                        </p>
                    </div>
                </div>
            </section>

            <div className="pt-8 border-t border-border/50">
                <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
                <div className="flex flex-wrap gap-4">
                    <Button asChild className="bg-primary text-primary-foreground">
                        <Link href="/docs/getting-started">
                            Get Started Guide <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/docs/api-reference">
                            View API Reference
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
