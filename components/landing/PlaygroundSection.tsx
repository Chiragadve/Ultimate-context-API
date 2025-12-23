"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Loader2, Copy, Check, Play, MapPin, Cloud, CircleDollarSign, Shield, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldOptions = [
    { id: "location", label: "Location", icon: MapPin },
    { id: "context.weather", label: "Weather", icon: Cloud },
    { id: "context.currency", label: "Currency", icon: CircleDollarSign },
    { id: "context.security", label: "Security", icon: Shield },
    { id: "context.holidays", label: "Holidays", icon: Calendar },
    { id: "location.timezone", label: "Time / Greeting", icon: Clock },
    { id: "context.device", label: "Device Info", icon: Clock },
];

export const PlaygroundSection = () => {
    const [ipAddress, setIpAddress] = useState("");
    const [selectedFields, setSelectedFields] = useState<string[]>(["location", "context.weather", "context.currency"]);
    const [response, setResponse] = useState<object | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Fetch user's IP on mount
    useEffect(() => {
        fetch("https://api.ipify.org?format=json")
            .then((res) => res.json())
            .then((data) => setIpAddress(data.ip))
            .catch(() => setIpAddress("8.8.8.8"));
    }, []);

    const getRequestUrl = () => {
        const fields = selectedFields.length > 0 ? selectedFields.join(",") : "";
        return `/enrich?ip=${ipAddress || "8.8.8.8"}${fields ? `&fields=${fields}` : ''}`;
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const fields = selectedFields.length > 0 ? selectedFields.join(",") : "";
            // Point to Production URL
            const url = `https://ultimate-context-api.vercel.app/v1/enrich?ip=${ipAddress || "8.8.8.8"}${fields ? `&fields=${fields}` : ''}`;

            const res = await fetch(url, {
                headers: {
                    "x-api-key": "sk_live_TEST_e7aa42e65145df137a6c839a220c0f91"
                }
            });

            if (!res.ok) {
                // Try to parse error message from JSON
                try {
                    const errData = await res.json();
                    throw new Error(errData.error || `HTTP ${res.status}: ${res.statusText}`);
                } catch (e) {
                    if (e instanceof Error && e.message.startsWith("HTTP")) throw e;
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch data");
            setResponse(null);
        } finally {
            setLoading(false);
        }
    }, [ipAddress, selectedFields]);

    const toggleField = (fieldId: string) => {
        setSelectedFields((prev) =>
            prev.includes(fieldId)
                ? prev.filter((f) => f !== fieldId)
                : [...prev, fieldId]
        );
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(`curl -H "x-api-key: YOUR_KEY" "https://ultimate-context-api.vercel.app/v1${getRequestUrl()}"`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="playground" ref={ref} className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.05),transparent_50%)]" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                    >
                        <Play className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Interactive Demo</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Test the{" "}
                        <span className="gradient-text">Ultimate Context API</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See real data from your IP address. Customize fields and explore the response.
                    </p>
                </motion.div>

                {/* Playground Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="glass-card overflow-hidden">
                        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
                            {/* Left Column - Input */}
                            <div className="p-6 lg:p-8">
                                <h3 className="text-lg font-semibold mb-6 text-foreground">Configure Request</h3>

                                {/* IP Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                                        IP Address
                                    </label>
                                    <input
                                        type="text"
                                        value={ipAddress}
                                        onChange={(e) => setIpAddress(e.target.value)}
                                        placeholder="Enter IP address..."
                                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm"
                                    />
                                </div>

                                {/* Field Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                                        Select Fields
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {fieldOptions.map((field) => {
                                            const Icon = field.icon;
                                            const isSelected = selectedFields.includes(field.id);

                                            return (
                                                <button
                                                    key={field.id}
                                                    onClick={() => toggleField(field.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                                                        ? "bg-primary/10 border-primary text-foreground"
                                                        : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/50"
                                                        }`}
                                                >
                                                    <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : ""}`} />
                                                    <span className="text-sm font-medium">{field.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Execute Button */}
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                    onClick={fetchData}
                                    disabled={loading || selectedFields.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Fetching...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Execute Request
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Right Column - Output */}
                            <div className="p-6 lg:p-8 bg-foreground/[0.02]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground">Response</h3>
                                    <button
                                        onClick={copyUrl}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-primary" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                        Copy cURL
                                    </button>
                                </div>

                                {/* Request URL */}
                                <div className="mb-4 p-3 rounded-lg bg-foreground/5 border border-border/50">
                                    <code className="text-xs text-primary font-mono break-all">
                                        GET /v1{getRequestUrl()}
                                    </code>
                                </div>

                                {/* Response Container */}
                                <div className="relative">
                                    <div className="h-[400px] overflow-auto rounded-xl bg-foreground text-background p-4 font-mono text-xs leading-relaxed">
                                        {loading && (
                                            <div className="flex items-center justify-center h-full">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            </div>
                                        )}

                                        {error && (
                                            <div className="text-rose-400">
                                                <span className="text-rose-500 font-semibold">Error:</span> {error}
                                                <p className="mt-2 text-muted-foreground/70">
                                                    Make sure the API server is operational
                                                </p>
                                            </div>
                                        )}

                                        {!loading && !error && response && (
                                            <pre className="whitespace-pre-wrap">
                                                {JSON.stringify(response, null, 2)}
                                            </pre>
                                        )}

                                        {!loading && !error && !response && (
                                            <div className="text-muted-foreground/50 text-center h-full flex items-center justify-center">
                                                Click "Execute Request" to see the response
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
