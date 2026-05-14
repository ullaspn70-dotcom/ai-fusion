"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Shield, Sparkles, ArrowRight, HeartPulse, Brain, Zap } from "lucide-react";
import ThreeDScene from "./ThreeDScene";

interface HeroProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
      {/* 3D Background */}
      <ThreeDScene />

      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hud-grid absolute inset-0 opacity-20" />
        <div className="scanline" />
        
        {/* Floating HUD Elements */}
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-10 hidden lg:block"
        >
          <div className="glass-panel p-4 rounded-xl hologram-border w-64">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 h-4 text-vitalis-cyan" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-vitalis-cyan">Live Diagnostics</span>
            </div>
            <div className="h-12 w-full bg-vitalis-cyan/10 rounded overflow-hidden relative">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-vitalis-cyan/30 to-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono">NEURAL_SCAN_ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel hologram-border mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-vitalis-cyan animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-vitalis-cyan">
            Next-Gen AI Healthcare OS
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-vitalis-cyan/50 bg-clip-text text-transparent leading-[1.1]"
        >
          Healthcare <br />
          <span className="italic font-light">Intelligence</span> <br />
          For The Future
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-vitalis-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          VITALIS AI integrates real-time neural diagnostics, predictive triage, and 
          cinematic health intelligence into a single holographic interface.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group px-8 py-4 bg-vitalis-cyan text-vitalis-bg font-bold rounded-full flex items-center gap-3 transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            Initialize System
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <button className="px-8 py-4 glass-panel rounded-full text-white font-medium hover:bg-white/5 transition-colors">
            Core Technologies
          </button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Brain, label: "Neural Logic", val: "99.9%" },
            { icon: HeartPulse, label: "Pulse Sync", val: "REAL-TIME" },
            { icon: Shield, label: "Biometric Sec", val: "AES-512" },
            { icon: Sparkles, label: "AI Precision", val: "LEVEL 5" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <item.icon className="w-6 h-6 text-vitalis-cyan mb-3 opacity-60" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-vitalis-muted">{item.label}</span>
              <span className="text-xl font-bold mt-1">{item.val}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
