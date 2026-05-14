"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AIAssistant from "@/components/AIAssistant";
import HealthDashboard from "@/components/HealthDashboard";
import EmergencyOverlay from "@/components/EmergencyOverlay";
import CursorTrail from "@/components/CursorTrail";
import { Heart, Activity, Shield, Brain, Menu, ChevronDown, Bell } from "lucide-react";

export default function Home() {
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate periodic emergency alert for demo
    const timer = setTimeout(() => {
      // setIsEmergencyMode(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <main className={`min-h-screen bg-vitalis-bg text-vitalis-text transition-colors duration-1000 ${isEmergencyMode ? 'emergency-mode' : ''}`}>
      <CursorTrail />
      
      {/* ─── Premium Navigation ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[60] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-8 py-4 rounded-full border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vitalis-cyan to-vitalis-blue flex items-center justify-center">
                <Heart className="w-5 h-5 text-vitalis-bg animate-heartbeat-cinematic" />
              </div>
              <div className="absolute inset-0 bg-vitalis-cyan blur-xl opacity-20" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tighter uppercase italic">Vitalis<span className="text-vitalis-cyan font-light not-italic">AI</span></h1>
              <span className="text-[9px] font-mono text-vitalis-muted tracking-[0.3em] uppercase">Hyper-Core OS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["Triage", "Analytics", "Neural Link", "Safety"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-mono uppercase tracking-widest text-vitalis-muted hover:text-vitalis-cyan transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
              className={`p-2.5 rounded-full transition-all ${isEmergencyMode ? 'bg-vitalis-red/20 text-vitalis-red' : 'glass-panel text-vitalis-muted hover:text-white'}`}
            >
              <Bell size={18} className={isEmergencyMode ? 'animate-bounce' : ''} />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <button className="flex items-center gap-3 pl-2 pr-6 py-2 glass-panel rounded-full hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
              <span className="text-[10px] font-mono tracking-widest uppercase">P_PN_402</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!isSystemActive && (
          <HeroSection key="hero" onStart={() => setIsSystemActive(true)} />
        )}
      </AnimatePresence>

      {/* ─── System Interface (Visible after Initialization) ───────────── */}
      <AnimatePresence>
        {isSystemActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative pt-32 pb-40"
          >
            {/* Background Medical HUD */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="hud-grid absolute inset-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vitalis-cyan/5 rounded-full blur-[120px]" />
            </div>

            {/* AI Assistant Section */}
            <section id="triage" className="relative z-10 px-6 mb-32">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vitalis-cyan/10 border border-vitalis-cyan/20">
                      <Brain className="w-4 h-4 text-vitalis-cyan" />
                      <span className="text-[10px] font-mono text-vitalis-cyan uppercase tracking-widest">Cognitive Triage</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                      Talk To Your <br />
                      <span className="text-vitalis-cyan italic">Neural Health.</span>
                    </h2>
                    <p className="text-vitalis-muted text-lg leading-relaxed max-w-lg">
                      Our advanced AI logic doesn't just listen to symptoms—it reconstructs 
                      your physiological state in real-time to detect anomalies before they manifest.
                    </p>
                  </motion.div>
                </div>
                <div className="lg:w-1/2 w-full">
                  <AIAssistant />
                </div>
              </div>
            </section>

            {/* Dashboard Section */}
            <section id="analytics" className="relative z-10">
              <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Biological Intelligence</h2>
                <p className="text-vitalis-muted font-mono uppercase tracking-[0.2em] text-xs">Patient_Telemetry_Monitoring_Active</p>
              </div>
              <HealthDashboard />
            </section>

            {/* Emergency Mode Trigger Area */}
            <section className="relative z-10 py-40 flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-3xl glass-panel rounded-[40px] p-12 hologram-border border-vitalis-cyan/20">
                <Shield className="w-16 h-16 text-vitalis-cyan mx-auto mb-8 animate-pulse" />
                <h2 className="text-4xl font-bold mb-6 italic">Secure The Future.</h2>
                <p className="text-vitalis-muted mb-10 leading-relaxed">
                  Join 50,000+ patients who trust Vitalis AI as their silent guardian. 
                  Encrypted, decentralized, and always intelligent.
                </p>
                <button className="px-12 py-5 bg-white text-vitalis-bg font-bold rounded-2xl hover:scale-105 transition-all">
                  UPGRADE_TO_ENTERPRISE_LINK
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Emergency Overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {isEmergencyMode && (
          <EmergencyOverlay onClose={() => setIsEmergencyMode(false)} />
        )}
      </AnimatePresence>

      {/* ─── Futuristic Footer ───────────────────────────────────────── */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-vitalis-cyan/10 flex items-center justify-center">
                <Heart size={16} className="text-vitalis-cyan" />
              </div>
              <h2 className="font-bold text-xl tracking-tighter uppercase italic">Vitalis<span className="text-vitalis-cyan font-light not-italic">AI</span></h2>
            </div>
            <p className="text-vitalis-muted text-sm max-w-sm leading-relaxed">
              Pioneering the intersection of artificial neural networks and precision medicine. 
              Built for the next generation of human longevity.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-mono text-vitalis-muted uppercase tracking-[0.3em] mb-6">Security</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-vitalis-cyan cursor-pointer transition-colors">HIPAA Compliance</li>
              <li className="hover:text-vitalis-cyan cursor-pointer transition-colors">Neural Encryption</li>
              <li className="hover:text-vitalis-cyan cursor-pointer transition-colors">Decentralized Data</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono text-vitalis-muted uppercase tracking-[0.3em] mb-6">System Status</h4>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-vitalis-emerald animate-pulse" />
              <span className="text-xs font-mono">Core_Engine: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-vitalis-emerald animate-pulse" />
              <span className="text-xs font-mono">Neural_Link: Synced</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-vitalis-muted uppercase tracking-[0.2em]">© 2026 VITALIS INTELLIGENCE SYSTEMS</p>
          <div className="flex gap-8">
             <span className="text-[10px] font-mono text-vitalis-muted uppercase hover:text-white cursor-pointer">Protocol_A7</span>
             <span className="text-[10px] font-mono text-vitalis-muted uppercase hover:text-white cursor-pointer">Terms_Of_Sync</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
