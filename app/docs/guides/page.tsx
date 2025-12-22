
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ShoppingCart, ShieldAlert } from "lucide-react";

export default function GuidesPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6">
                    Use Cases & Examples
                </h1>
                <p className="text-xl text-muted-foreground">
                    Learn how to leverage Ultimate Context API to build smarter applications.
                </p>
            </div>

            {/* Use Case 1 */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Smart E-commerce Localization</h2>
                </div>
                <p className="text-muted-foreground">
                    Automatically detect a user's currency and verify if their location considers today a "Holiday" (affecting shipping).
                </p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-sm overflow-x-auto">
                    <pre className="text-blue-300">
                        {`const data = await client.enrich({ ip: userIP });

if (data.context.currency.code !== 'USD') {
  showCurrencyBanner(data.context.currency); // "Shop in EUR!"
}

if (data.context.holidays.is_holiday) {
  showShippingDelayWarning(data.context.holidays.name); 
  // "Shipping delayed due to Christmas Day"
}`}
                    </pre>
                </div>
            </section>

            {/* Use Case 2 */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/20 rounded-lg text-destructive">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Fraud Prevention Gate</h2>
                </div>
                <p className="text-muted-foreground">
                    Block high-risk traffic from TOR nodes or known proxy servers before they access your login page.
                </p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-sm overflow-x-auto">
                    <pre className="text-blue-300">
                        {`const { context } = await client.enrich({ ip: req.ip });

if (context.security.is_tor || context.security.risk_score > 80) {
    return res.status(403).send("Access Denied: High Risk detected");
}`}
                    </pre>
                </div>
            </section>

            <Alert className="bg-secondary/10 border-primary/20">
                <Terminal className="h-4 w-4 text-primary" />
                <AlertTitle>Optimization Tip</AlertTitle>
                <AlertDescription>
                    Always use the `fields` parameter in production to reduce latency. If you only need currency, don't fetch weather!
                </AlertDescription>
            </Alert>
        </div>
    );
}
