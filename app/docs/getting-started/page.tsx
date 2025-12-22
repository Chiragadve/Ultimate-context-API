
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GettingStartedPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6">
                    Getting Started
                </h1>
                <p className="text-xl text-muted-foreground">
                    Follow this guide to get your API key and make your first request in under 2 minutes.
                </p>
            </div>

            {/* Prerequisites */}
            <section id="prerequisites">
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>A valid email address.</li>
                    <li>Basic knowledge of HTTP requests (curl, JavaScript, Python, etc.).</li>
                </ul>
            </section>

            {/* 1. Account Creation */}
            <section id="account-creation">
                <h2 className="text-2xl font-bold mb-4">1. Create an Account</h2>
                <p className="text-muted-foreground mb-4">
                    You need an account to generate an API key.
                </p>
                <div className="bg-secondary/10 p-6 rounded-xl border border-border/50">
                    <ol className="list-decimal pl-6 space-y-4 text-muted-foreground">
                        <li>Navigate to the <Link href="/login" className="text-primary hover:underline font-semibold">Login Page</Link>.</li>
                        <li>Click <strong>"Don't have an account? Sign Up"</strong>.</li>
                        <li>Enter your email and password.</li>
                        <li>You will be automatically redirected to the <strong>Dashboard</strong> upon success.</li>
                    </ol>
                </div>
            </section>

            {/* 2. Generating Key */}
            <section id="api-key">
                <h2 className="text-2xl font-bold mb-4">2. Generate an API Key</h2>
                <p className="text-muted-foreground mb-4">
                    Once in the dashboard, you will see your "API Access" card.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Click the <strong className="text-primary">Generate New Key</strong> button.</li>
                    <li>Your new API key (starting with `sk_...`) will appear.</li>
                    <li><strong>Copy this key immediately.</strong> We do not store it in plain text.</li>
                </ul>
            </section>

            {/* 3. First API Call */}
            <section id="first-call">
                <h2 className="text-2xl font-bold mb-6">3. Make Your First Request</h2>
                <p className="text-muted-foreground mb-6">
                    Use your new API key to fetch enriched context for an IP address. Replace `YOUR_API_KEY` with your actual key.
                </p>

                <div className="space-y-8">
                    {/* CURL */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground/80">cURL</h3>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-sm overflow-x-auto">
                            <pre className="text-blue-400">
                                {`curl -X GET "http://localhost:4000/v1/enrich?ip=8.8.8.8" \\
     -H "x-api-key: YOUR_API_KEY"`}
                            </pre>
                        </div>
                    </div>

                    {/* JavaScript */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground/80">JavaScript (Fetch)</h3>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-border font-mono text-sm overflow-x-auto">
                            <pre className="text-green-400">
                                {`const apiKey = 'YOUR_API_KEY';

fetch('http://localhost:4000/v1/enrich?ip=8.8.8.8', {
  headers: {
    'x-api-key': apiKey
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pt-8 border-t border-border/50">
                <p className="text-muted-foreground mb-4">
                    🎉 <strong>Success!</strong> You have made your first API call.
                </p>
                <Button asChild>
                    <Link href="/docs/api-reference">
                        Explore Full API Reference
                    </Link>
                </Button>
            </div>
        </div>
    );
}
