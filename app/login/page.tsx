'use client';

import { useState } from 'react';
import { supabaseClient } from '../lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // Validation for Sign Up
        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                // --- SIGN UP ---
                const { error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("Registration successful! You can now log in.");
                setIsSignUp(false);
                setPassword('');
                setConfirmPassword('');
            } else {
                // --- SIGN IN ---
                const { error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md p-8 relative z-10 glass-card">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">
                        {isSignUp ? 'Join Ultimate Context API' : 'Sign in to manage your keys'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl bg-secondary/30 border border-border px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl bg-secondary/30 border border-border px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                        />
                    </div>

                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl bg-secondary/30 border border-border px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl h-12 text-[15px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                            setMessage(null);
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground/60">
                    <Link href="/" className="hover:text-foreground transition-colors flex items-center justify-center gap-1 group">
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
