"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Globe2, Shield, Zap } from "lucide-react";

const FloatingOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <motion.div
        className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
        animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
        }}
    />
);

const FloatingIcon = ({ Icon, className, delay = 0 }: { Icon: typeof Globe2; className: string; delay?: number }) => (
    <motion.div
        className={`absolute ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.6 }}
    >
        <motion.div
            className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center shadow-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
        >
            <Icon className="w-6 h-6 text-primary" />
        </motion.div>
    </motion.div>
);

export const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <FloatingOrb className="w-[600px] h-[600px] bg-primary top-0 -right-32" delay={0} />
                <FloatingOrb className="w-[500px] h-[500px] bg-accent -bottom-20 -left-20" delay={2} />
                <FloatingOrb className="w-[300px] h-[300px] bg-primary/50 top-1/2 left-1/3" delay={4} />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* Floating Icons */}
            <div className="hidden md:block">
                <FloatingIcon Icon={Globe2} className="top-1/4 left-[10%]" delay={0} />
                <FloatingIcon Icon={Shield} className="top-1/3 right-[12%]" delay={0.2} />
                <FloatingIcon Icon={Zap} className="bottom-1/4 left-[15%]" delay={0.4} />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Real-time context in milliseconds
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
                    >
                        The{" "}
                        <span className="gradient-text">Ultimate</span>
                        <br />
                        Context API
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto"
                    >
                        Everything you need to understand your users, in one API call.
                    </motion.p>

                    {/* Supporting Line */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-base md:text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto"
                    >
                        Detect location, personalize content, convert globally, and block threats in real time.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button variant="hero" size="xl" className="group w-full sm:w-auto" asChild>
                            <a href="#playground">
                                Test the API
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </Button>
                        <Button variant="hero-outline" size="xl" className="group w-full sm:w-auto" asChild>
                            <a href="/docs">
                                <BookOpen className="w-5 h-5" />
                                Read the Docs
                            </a>
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
                    >
                        {[
                            { value: "< 50ms", label: "Avg Response" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "6+", label: "Data Sources" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1.5 h-2.5 rounded-full bg-primary"
                        animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};
