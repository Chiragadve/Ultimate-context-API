"use client";

import { motion } from "framer-motion";
import { Zap, Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = {
    product: [
        { label: "Docs", href: "#docs" },
        { label: "API Reference", href: "#" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#" },
    ],
    resources: [
        { label: "Use Cases", href: "#use-cases" },
        { label: "Playground", href: "#playground" },
        { label: "Status", href: "#" },
        { label: "Blog", href: "#" },
    ],
    company: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
    ],
};

const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@contextapi.com", label: "Email" },
];

export const Footer = () => {
    return (
        <footer className="relative pt-20 pb-8 border-t border-border/50">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-4 group ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">
                                Context<span className="gradient-text">API</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs mb-6">
                            Real-time user context in a single request. Location, weather, currency, security, and more.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Context API. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Built with ❤️ for developers worldwide
                    </p>
                </div>
            </div>
        </footer>
    );
};
