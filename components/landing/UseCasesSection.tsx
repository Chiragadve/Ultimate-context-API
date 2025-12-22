"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingCart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

const useCases = [
    {
        icon: ShoppingCart,
        title: "E-Commerce",
        color: "from-emerald-500 to-teal-500",
        problem: "Auto-detect currency, region, and holidays",
        outcomes: [
            "Increase global conversion rates",
            "Reduce checkout friction",
            "Localize pricing instantly",
        ],
    },
    {
        icon: ShieldCheck,
        title: "Cybersecurity",
        color: "from-rose-500 to-orange-500",
        problem: "Detect malicious IPs instantly",
        outcomes: [
            "Trust scores and threat intelligence",
            "Stop bots before they hit your backend",
            "Real-time abuse detection",
        ],
    },
    {
        icon: Sparkles,
        title: "Smart Content & UX",
        color: "from-violet-500 to-purple-500",
        problem: "Personalized greetings by time and weather",
        outcomes: [
            "Region-aware messaging",
            "Context-aware user experiences",
            "Dynamic content adaptation",
        ],
    },
];

const UseCaseCard = ({ useCase, index }: { useCase: typeof useCases[0]; index: number }) => {
    const Icon = useCase.icon;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <div className="glass-card p-8 h-full relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl">
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${useCase.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-foreground">{useCase.title}</h3>

                {/* Problem */}
                <p className="text-muted-foreground mb-6">{useCase.problem}</p>

                {/* Outcomes */}
                <ul className="space-y-3">
                    {useCase.outcomes.map((outcome, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: index * 0.15 + i * 0.1 + 0.3 }}
                            className="flex items-start gap-3 text-sm"
                        >
                            <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground/80">{outcome}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export const UseCasesSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="use-cases" ref={ref} className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.03),transparent_50%)]" />

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
                        <span className="text-sm font-medium text-muted-foreground">Use Cases</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Built for{" "}
                        <span className="gradient-text">Every Stack</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From e-commerce to security, our API adapts to your needs
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {useCases.map((useCase, index) => (
                        <UseCaseCard key={useCase.title} useCase={useCase} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};
