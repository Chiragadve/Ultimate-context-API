'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../lib/supabase-client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Copy, Check, Key, User as UserIcon, LogOut, Zap, Mail, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUser(session.user);
                fetchApiKey(session.access_token);
            }
            setLoading(false);
        };

        checkUser();
    }, [router]);

    const fetchApiKey = async (token: string) => {
        try {
            const res = await fetch('/api/auth/api-keys', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setApiKey(data.key);
            }
        } catch (e) {
            console.error('Failed to fetch key', e);
        }
    };

    const generateKey = async () => {
        setGenerating(true);
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) return;

            const res = await fetch('/api/auth/api-keys', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setApiKey(data.key);
                // Also refresh stats/profile if needed
                // router.refresh();
            } else {
                alert('Failed to generate key');
            }
        } catch (e) {
            console.error('Error generating key', e);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <div className="text-muted-foreground animate-pulse">Loading Dashboard...</div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                            <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-foreground">Ultimate Context API</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            await supabaseClient.auth.signOut();
                            router.push('/');
                        }}
                        className="text-muted-foreground hover:text-foreground gap-2 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Dashboard</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your API keys and secure access.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Profile Card */}
                    <div className="glass-card p-8 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">Your Profile</h2>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Email</label>
                                </div>
                                <div className="font-mono text-sm text-foreground pl-7">{user.email}</div>
                            </div>

                            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">User ID</label>
                                </div>
                                <div className="font-mono text-xs text-muted-foreground break-all pl-7">{user.id}</div>
                            </div>
                        </div>
                    </div>

                    {/* API Access Card */}
                    <div className="glass-card p-8 flex flex-col h-full relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Key className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">API Access</h2>
                        </div>

                        <div className="flex flex-col items-center justify-center h-full py-4 text-center relative z-10">
                            {apiKey ? (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-medium text-muted-foreground">Active API Key</p>
                                        <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                            Active
                                        </div>
                                    </div>

                                    {apiKey.includes('...') ? (
                                        <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm text-left flex items-start gap-3">
                                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                            <div>
                                                <strong>Legacy Key Detected</strong>
                                                <p className="mt-1 opacity-90 text-xs leading-relaxed">This key is masked and cannot be copied. Please generate a new key to enable full access.</p>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="flex items-center gap-2 mb-4 group">
                                        <div className="flex-1 bg-secondary/50 border border-border rounded-xl p-4 font-mono text-sm text-primary break-all text-left shadow-sm group-hover:border-primary/30 transition-colors">
                                            {apiKey}
                                        </div>
                                        <CopyButton text={apiKey} />
                                    </div>

                                    <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground bg-secondary/30 py-2 rounded-lg border border-border/50">
                                        <span>Header:</span>
                                        <code className="text-primary font-mono bg-primary/5 px-1.5 py-0.5 rounded">x-api-key</code>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 text-muted-foreground">
                                        <Key className="w-8 h-8" />
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                                        You don't have an active API Key yet. Generate one to start making requests.
                                    </p>
                                    <Button
                                        onClick={generateKey}
                                        disabled={generating}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 cursor-pointer"
                                        size="lg"
                                    >
                                        {generating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4 mr-2" />
                                                Generate API Key
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!text || text.includes('...')) return; // Prevent copying masked keys
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={text.includes('...')}
            className={`h-full aspect-square rounded-xl border-border bg-secondary/50 hover:bg-secondary hover:text-primary transition-all cursor-pointer ${copied ? 'border-primary/50 text-primary' : ''}`}
            title="Copy Key"
        >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
    );
}
