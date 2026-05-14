"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Shield, Sparkles, ArrowRight, HeartPulse, Brain, Zap, Fingerprint, Database } from "lucide-react";
import ThreeDScene from "./ThreeDScene";

interface HeroProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
  };

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
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] hidden xl:block"
        >
          <div className="glass-panel p-6 rounded-[32px] hologram-border w-72 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-vitalis-cyan" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-vitalis-cyan">Telemetry_Buffer</span>
              </div>
              <span className="text-[9px] font-mono text-vitalis-emerald animate-pulse">LIVE</span>
            </div>
            <div className="space-y-3">
               {[1, 0.6, 0.8].map((w, i) => (
                  <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${w * 100}%` }}
                        transition={{ duration: 2, delay: i * 0.2 }}
                        className="h-full bg-gradient-to-r from-vitalis-cyan to-vitalis-blue" 
                     />
                  </div>
               ))}
            </div>
            <p className="text-[9px] font-mono text-vitalis-muted mt-4 text-center">NEURAL_DECODING_IN_PROGRESS...</p>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[8%] hidden xl:block"
        >
          <div className="glass-panel p-6 rounded-[32px] hologram-border w-64 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-2 rounded-xl bg-vitalis-cyan/10">
                  <Fingerprint className="w-5 h-5 text-vitalis-cyan" />
               </div>
               <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-white">Biometric_Sync</h4>
                  <p className="text-[8px] font-mono text-vitalis-muted">Awaiting_Neural_Handshake</p>
               </div>
            </div>
            <div className="h-12 flex items-end gap-1">
               {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div 
                     key={i}
                     animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
                     transition={{ duration: 0.5 + Math.random(), repeat: Infinity, repeatType: "reverse" }}
                     className="flex-1 bg-vitalis-cyan/20 rounded-t-sm"
                  />
               ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto text-center"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel hologram-border mb-10 shadow-lg"
        >
          <div className="w-2 h-2 rounded-full bg-vitalis-cyan animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-vitalis-cyan">
            VITALIS_CORE // VERSION 4.0.2 // AI_ACTIVE
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-7xl md:text-[120px] font-bold tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-vitalis-cyan/30 bg-clip-text text-transparent leading-[0.9] italic"
        >
          Healthcare <br />
          <span className="font-light not-italic text-glow-cyan">Intelligence</span> <br />
          For The Future.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-vitalis-muted max-w-3xl mx-auto mb-14 leading-relaxed font-light"
        >
          Experience the future of preventative medicine with an AI-driven operating system 
          built for real-time physiological synchronization and neural diagnostics.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative px-10 py-5 bg-vitalis-cyan text-vitalis-bg font-black rounded-2xl flex items-center gap-4 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Zap className="w-6 h-6 fill-current" />
            <span className="tracking-[0.1em]">INITIALIZE_SYSTEM</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>

          <button className="px-10 py-5 glass-panel rounded-2xl text-white font-bold tracking-widest hover:bg-white/5 transition-all border border-white/10 flex items-center gap-3">
            <Database className="w-5 h-5 text-vitalis-muted" />
            PROTOCOL_OVERVIEW
          </button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          variants={itemVariants}
          className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/5 pt-16"
        >
          {[
            { icon: Brain, label: "Neural Logic", val: "99.9%", desc: "COGNITIVE_TRIAGE" },
            { icon: HeartPulse, label: "Pulse Sync", val: "REAL-TIME", desc: "LIVE_TELEMETRY" },
            { icon: Shield, label: "Biometric Sec", val: "AES-512", desc: "ENCRYPT_LINK" },
            { icon: Sparkles, label: "AI Precision", val: "LEVEL 5", desc: "PREDICTIVE_MOD" },
          ].map((item, i) => (
            <motion.div 
               key={i} 
               whileHover={{ y: -5 }}
               className="flex flex-col items-center group cursor-default"
            >
              <div className="p-3 rounded-2xl bg-white/5 mb-4 group-hover:bg-vitalis-cyan/10 transition-colors">
                 <item.icon className="w-6 h-6 text-vitalis-cyan opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-vitalis-muted mb-1">{item.label}</span>
              <span className="text-2xl font-black text-white">{item.val}</span>
              <span className="text-[9px] font-mono text-vitalis-cyan/40 mt-1">{item.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
