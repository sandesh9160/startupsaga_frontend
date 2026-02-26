"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
            <div className="relative flex flex-col items-center text-center">
                {/* Main Logo / Icon Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative mb-8"
                >
                    <div className="absolute -inset-4 bg-orange-100/50 rounded-full blur-2xl animate-pulse" />
                    <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/20 relative">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                </motion.div>

                {/* Text Animation */}
                <div className="space-y-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-serif font-bold text-slate-900 tracking-tight"
                    >
                        StartupSaga.in
                    </motion.h2>

                    <div className="flex items-center gap-1.5 justify-center">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="w-1.5 h-1.5 bg-orange-600 rounded-full"
                            />
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.5 }}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 pt-2"
                    >
                        Preparing the Journey
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
