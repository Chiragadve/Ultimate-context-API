import Link from "next/link";
import { Book, Code, Key, Shield, Zap } from "lucide-react";

const sidebarItems = [
    {
        title: "Introduction",
        items: [
            { title: "Overview", href: "/docs", icon: Book },
        ]
    },
    {
        title: "Getting Started",
        items: [
            { title: "Quickstart", href: "/docs/getting-started", icon: Zap },
        ]
    },
    {
        title: "API Reference",
        items: [
            { title: "Full Reference", href: "/docs/api-reference", icon: Code },
            { title: "Authentication", href: "/docs/api-reference#authentication", icon: Key },
            { title: "Endpoints", href: "/docs/api-reference#endpoints", icon: Shield },
        ]
    },
    {
        title: "Guides",
        items: [
            { title: "Use Cases", href: "/docs/guides", icon: Book },
        ]
    }
];

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none" />

            <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 glass-card p-6 rounded-xl border border-border/50">
                            <nav className="space-y-8">
                                {sidebarItems.map((section) => (
                                    <div key={section.title}>
                                        <h3 className="mb-3 text-sm font-semibold text-foreground tracking-wider uppercase">
                                            {section.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {section.items.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                                                    >
                                                        <item.icon className="w-4 h-4" />
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="glass-card p-8 rounded-xl border border-border/50 min-h-[80vh]">
                            <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-secondary/30">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
