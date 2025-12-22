"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-zinc-950/60 backdrop-blur-sm"
                    />

                    {/* Content Container - Fixed Position */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md pointer-events-auto"
                        >
                            <div className="glass-card relative overflow-hidden rounded-2xl border border-cyan-500/20 p-6 shadow-2xl">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {title && (
                                    <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                        {title}
                                    </h2>
                                )}

                                <div className="text-muted-foreground">
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
