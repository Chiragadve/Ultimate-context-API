"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Free",
        subtitle: "Hacker",
        price: "$0",
        period: "forever",
        icon: Zap,
        description: "Perfect for prototyping and side projects",
        features: [
            "100 requests per minute",
            "All data fields included",
            "Community support",
            "Standard rate limits",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        subtitle: "Most Popular",
        price: "$29",
        period: "/month",
        icon: Sparkles,
        description: "For production apps with real traffic",
        features: [
            "10,000 requests per minute",
            "All data fields included",
            "Priority support",
            "Higher rate limits",
            "Webhook integrations",
            "Usage analytics",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        subtitle: "Custom",
        price: "Custom",
        period: "",
        icon: Building2,
        description: "For organizations with mission-critical needs",
        features: [
            "Unlimited requests",
            "Custom SLAs",
            "Dedicated support",
            "On-premise deployment",
            "Custom integrations",
            "SSO & compliance",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

import { Modal } from "@/components/ui/modal";
import { useState } from "react";

// ... existing imports ...

// Move logic inside PricingSection or pass handlers to PricingCard
const PricingCard = ({ plan, index, onOpenComingSoon }: { plan: typeof plans[0]; index: number; onOpenComingSoon: () => void }) => {
    // ... existing hook calls ...
    const Icon = plan.icon;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            // ... props
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
            className={`relative flex flex-col h-full rounded-2xl border transition-all duration-300 ${plan.popular
                ? "border-cyan-500 shadow-2xl bg-cyan-50/50 z-20 scale-105"
                : "border-border hover:border-cyan-300 hover:shadow-xl bg-card"
                }`}
        >
            {/* ... rest of jsx ... */}
            {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-40 rounded-full bg-cyan-500 text-white text-sm font-bold py-2 text-center shadow-lg uppercase tracking-wide z-50">
                    Most Popular
                </div>
            )}
            <div
                className={`glass-card p-8 h-full relative overflow-hidden transition-all duration-500 ${plan.popular
                    ? "border-cyan-500/30 shadow-2xl ring-1 ring-cyan-500/20"
                    : "hover:shadow-2xl"
                    }`}
            >
                {/* Background Glow for Popular */}
                {plan.popular && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                )}

                <div className="relative z-10">
                    {/* Icon */}
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                            : "bg-secondary text-cyan-600"
                            }`}
                    >
                        <Icon
                            className={`w-7 h-7 ${plan.popular ? "text-white" : "text-cyan-600"
                                }`}
                        />
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-muted-foreground text-sm mb-4">{plan.description}</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                        </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Check className={`w-5 h-5 ${plan.popular ? "text-cyan-500" : "text-cyan-500"}`} />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {plan.name === "Free" ? (
                        <Button
                            asChild
                            variant={plan.popular ? "default" : "outline"}
                            className={`w-full ${plan.popular ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20" : "hover:text-cyan-600 hover:border-cyan-200"}`}
                            size="lg"
                        >
                            <Link href="/login">{plan.cta}</Link>
                        </Button>
                    ) : (
                        <Button
                            variant={plan.popular ? "default" : "outline"}
                            className={`w-full ${plan.popular ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20" : "hover:text-cyan-600 hover:border-cyan-200"}`}
                            size="lg"
                            onClick={onOpenComingSoon}
                        >
                            {plan.cta}
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const PricingSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [showComingSoon, setShowComingSoon] = useState(false);

    return (
        <section id="pricing" ref={ref} className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,hsl(var(--primary)/0.05),transparent_50%)]" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Simple Pricing</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Start Free,{" "}
                        <span className="gradient-text">Scale Infinitely</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From side projects to enterprise applications, we've got you covered
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            index={index}
                            onOpenComingSoon={() => setShowComingSoon(true)}
                        />
                    ))}
                </div>

                {/* Trust Line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center text-sm text-muted-foreground mt-12"
                >
                    Trusted by 10,000+ developers worldwide. No credit card required to start.
                </motion.p>
            </div>

            {/* Coming Soon Modal */}
            <Modal
                isOpen={showComingSoon}
                onClose={() => setShowComingSoon(false)}
                title="Coming Soon!"
            >
                <div className="flex flex-col gap-4">
                    <p>
                        We are currently fine-tuning this plan to provide you with the best experience possible.
                    </p>
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-semibold text-primary block mb-1">Recommendation</span>
                            Start building immediately with our <span className="font-bold text-foreground">Free Tier</span>. It includes generous limits and full feature access!
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setShowComingSoon(false)}>
                            Close
                        </Button>
                        <Button asChild onClick={() => setShowComingSoon(false)}>
                            <Link href="/login">Try for Free</Link>
                        </Button>
                    </div>
                </div>
            </Modal>
        </section>
    );
};
