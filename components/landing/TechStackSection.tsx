"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Cloud, CircleDollarSign, Shield, MapPin, Calendar } from "lucide-react";

const dataSources = [
    {
        name: "Visual Crossing",
        description: "Weather Data",
        icon: Cloud,
    },
    {
        name: "Frankfurter",
        description: "Currency Rates",
        icon: CircleDollarSign,
    },
    {
        name: "AbuseIPDB",
        description: "Security Intel",
        icon: Shield,
    },
    {
        name: "IP-API",
        description: "Geo & IP Data",
        icon: MapPin,
    },
    {
        name: "Nager.Date",
        description: "Holiday Data",
        icon: Calendar,
    },
];

const DataSourceCard = ({ source, index }: { source: typeof dataSources[0]; index: number }) => {
    const Icon = source.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group flex-shrink-0 w-48"
        >
            <div className="glass-card p-6 text-center transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/30">
                <div
                    className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: "rgba(6,182,212, 0.15)" }}
                >
                    <Icon className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{source.name}</h3>
                <p className="text-xs text-muted-foreground">{source.description}</p>
            </div>
        </motion.div>
    );
};

export const TechStackSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Powered by{" "}
                        <span className="gradient-text">Best-in-Class</span> Data
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        We aggregate the most reliable APIs to give you comprehensive context data
                    </p>
                </motion.div>

                {/* Marquee Container */}
                <div className="relative">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    {/* Cards Grid for Desktop */}
                    <div className="hidden md:flex justify-center gap-6 flex-wrap">
                        {dataSources.map((source, index) => (
                            <DataSourceCard key={source.name} source={source} index={index} />
                        ))}
                    </div>

                    {/* Scrolling Marquee for Mobile */}
                    <div className="md:hidden overflow-hidden">
                        <motion.div
                            className="flex gap-6"
                            animate={{ x: [0, -400] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            {[...dataSources, ...dataSources].map((source, index) => (
                                <DataSourceCard key={`${source.name}-${index}`} source={source} index={0} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
