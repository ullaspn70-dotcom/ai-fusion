"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AIAssistant from "@/components/AIAssistant";
import HealthDashboard from "@/components/HealthDashboard";
import EmergencyOverlay from "@/components/EmergencyOverlay";
import CursorTrail from "@/components/CursorTrail";
import FeatureSection from "@/components/FeatureSection";
import { Heart, Brain, Bell, Shield, Activity, Fingerprint, Lock, Loader2, Globe, Cpu } from "lucide-react";

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = [
    "VITALIS_CORE_v4.0.2_INITIATED",
    "DECRYPTING_NEURAL_LAYER... DONE",
    "SYNCING_BIOMETRIC_TELEMETRY... OK",
    "STABLIZING_HOLOGRAPHIC_INTERFACE...",
    "LINKING_GEMINI_AI_CLUSTER... ACTIVE",
    "PROTOCOL_ZERO_READY"
  ];

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      }
    }, 400);

    const progInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(logInterval);
      clearInterval(progInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-vitalis-bg flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-12">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-xl bg-vitalis-cyan/10 flex items-center justify-center border border-vitalis-cyan/20"
          >
            <Loader2 className="text-vitalis-cyan w-6 h-6" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold tracking-tighter italic">VITALIS<span className="font-light not-italic text-vitalis-cyan">OS</span></h2>
            <p className="text-[10px] font-mono text-vitalis-muted uppercase tracking-[0.3em]">Neural Boot Sequence</p>
          </div>
        </div>

        <div className="space-y-2 mb-8 font-mono text-[10px] text-vitalis-cyan/60 h-32 overflow-hidden">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-vitalis-cyan">{">"}</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
          <motion.div 
            className="h-full bg-vitalis-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-vitalis-muted">
           <span>SYSTEM_INTEGRITY: OK</span>
           <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={`min-h-screen bg-vitalis-bg text-vitalis-text transition-colors duration-1000 ${isEmergencyMode ? 'emergency-mode' : ''}`}>
      <CursorTrail />
      
      {/* ─── Premium Navigation ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[60] p-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-8 py-4 rounded-3xl border-white/5 shadow-2xl backdrop-blur-3xl"
        >
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-vitalis-cyan to-vitalis-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-vitalis-bg animate-heartbeat-cinematic" />
              </div>
              <div className="absolute inset-0 bg-vitalis-cyan blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter uppercase italic leading-none">Vitalis<span className="text-vitalis-cyan font-light not-italic">AI</span></h1>
              <span className="text-[9px] font-mono text-vitalis-muted tracking-[0.4em] uppercase">Hyper-Core OS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-12">
            {["Features", "Triage", "Analytics", "Safety"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-mono uppercase tracking-[0.2em] text-vitalis-muted hover:text-vitalis-cyan transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-vitalis-cyan group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
              className={`p-3 rounded-2xl transition-all ${isEmergencyMode ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'glass-panel text-vitalis-muted hover:text-white'}`}
            >
              <Bell size={20} className={isEmergencyMode ? 'animate-bounce' : ''} />
            </motion.button>
            <div className="h-8 w-px bg-white/10" />
            <button className="flex items-center gap-4 pl-2 pr-6 py-2 glass-panel rounded-2xl hover:bg-white/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden">
                 <Fingerprint className="text-white/20 group-hover:text-vitalis-cyan transition-colors" size={24} />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-mono tracking-widest uppercase leading-none">P_PN_402</span>
                <span className="text-[8px] font-mono text-vitalis-emerald uppercase">Authenticated</span>
              </div>
            </button>
          </div>
        </motion.div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!isSystemActive && !isBooting && (
          <HeroSection key="hero" onStart={() => setIsBooting(true)} />
        )}
        {isBooting && (
          <BootSequence key="boot" onComplete={() => {
            setIsBooting(false);
            setIsSystemActive(true);
          }} />
        )}
      </AnimatePresence>

      {/* ─── System Interface (Visible after Initialization) ───────────── */}
      <AnimatePresence>
        {isSystemActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative pt-40 pb-40"
          >
            {/* Background Medical HUD */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="hud-grid absolute inset-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-vitalis-cyan/5 rounded-full blur-[150px]" />
              <div className="scanline" />
            </div>

            {/* Features Section */}
            <FeatureSection />

            {/* AI Assistant Section */}
            <section id="triage" className="relative z-10 px-6 py-40">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-vitalis-cyan/10 border border-vitalis-cyan/20 shadow-lg">
                      <Brain className="w-4 h-4 text-vitalis-cyan" />
                      <span className="text-[10px] font-mono text-vitalis-cyan uppercase tracking-[0.2em]">Cognitive Triage Active</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] italic">
                      Talk To Your <br />
                      <span className="text-glow-cyan not-italic font-light">Neural Core.</span>
                    </h2>
                    <p className="text-vitalis-muted text-xl leading-relaxed max-w-xl font-light">
                      VITALIS CORE doesn't just process words—it analyzes the semantic 
                      resonance of your physiological symptoms to predict high-risk anomalies.
                    </p>
                    <div className="flex gap-4">
                       <div className="p-4 rounded-2xl glass-panel border-white/5 flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-vitalis-muted uppercase">Model</span>
                          <span className="text-xs font-bold text-vitalis-cyan">GEMINI_2.0_ULTRA</span>
                       </div>
                       <div className="p-4 rounded-2xl glass-panel border-white/5 flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-vitalis-muted uppercase">Encryption</span>
                          <span className="text-xs font-bold text-vitalis-emerald">QUANTUM_LOCKED</span>
                       </div>
                    </div>
                  </motion.div>
                </div>
                <div className="lg:w-1/2 w-full">
                  <AIAssistant />
                </div>
              </div>
            </section>

            {/* Dashboard Section */}
            <section id="analytics" className="relative z-10 px-6 py-40">
              <div className="max-w-7xl mx-auto mb-16">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                 >
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">Biological Intelligence</h2>
                    <div className="flex flex-wrap items-center gap-6">
                       <p className="text-vitalis-muted font-mono uppercase tracking-[0.3em] text-xs">Patient_Telemetry_Monitoring: Active</p>
                       <div className="h-px flex-1 bg-white/5" />
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-vitalis-emerald animate-pulse" />
                          <span className="text-[10px] font-mono uppercase">Sync_100%</span>
                       </div>
                    </div>
                 </motion.div>
              </div>
              <HealthDashboard />
            </section>

            {/* Technology Section */}
            <section className="relative py-40 overflow-hidden">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                     >
                        <div className="aspect-square glass-panel rounded-[60px] border-white/5 flex items-center justify-center relative overflow-hidden group">
                           <Cpu className="w-40 h-40 text-vitalis-cyan opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
                           <div className="absolute top-0 left-0 w-full h-full hud-grid opacity-10" />
                        </div>
                        {/* Floating elements */}
                        <motion.div 
                           animate={{ y: [0, -20, 0] }}
                           transition={{ duration: 4, repeat: Infinity }}
                           className="absolute -top-10 -right-10 glass-panel p-6 rounded-3xl hologram-border"
                        >
                           <Globe className="text-vitalis-cyan mb-2" size={24} />
                           <span className="text-[10px] font-mono uppercase">Global_Node</span>
                        </motion.div>
                     </motion.div>
                     
                     <div className="space-y-8">
                        <h2 className="text-5xl font-black italic tracking-tighter leading-none">The Architecture of <span className="text-glow-cyan not-italic font-light">Longevity.</span></h2>
                        <p className="text-vitalis-muted text-lg font-light leading-relaxed">
                           Our proprietary neural architecture scales across billions of parameters to synthesize
                           a comprehensive map of human biological performance.
                        </p>
                        <div className="space-y-4">
                           {["Quantum Data Layer", "Semantic Symptom Mapping", "Real-time Neural Sync"].map((tech, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl glass-panel border-white/5 group hover:border-vitalis-cyan/30 transition-all">
                                 <div className="w-2 h-2 rounded-full bg-vitalis-cyan" />
                                 <span className="text-sm font-bold tracking-tight">{tech}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Emergency Mode Trigger Area */}
            <section id="safety" className="relative z-10 py-60 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-vitalis-cyan/10 blur-[120px] -rotate-12 pointer-events-none" />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl glass-panel rounded-[60px] p-20 hologram-border border-vitalis-cyan/20 shadow-2xl relative"
              >
                <div className="absolute top-10 left-10 opacity-10">
                   <Lock size={120} className="text-vitalis-cyan" />
                </div>
                <Shield className="w-20 h-20 text-vitalis-cyan mx-auto mb-10 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-black mb-8 italic tracking-tighter">Secure Your Future.</h2>
                <p className="text-vitalis-muted text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                  Join the elite 0.01% who manage their longevity through the world's most 
                  advanced AI-driven medical intelligence platform.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-6 bg-white text-vitalis-bg font-black rounded-2xl hover:bg-vitalis-cyan hover:text-white transition-all shadow-xl tracking-widest"
                >
                  UPGRADE_TO_ENTERPRISE_LINK
                </motion.button>
              </motion.div>
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
      <footer className="relative z-10 py-32 px-6 border-t border-white/5 bg-black/80 backdrop-blur-3xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-vitalis-cyan/20 to-transparent" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-vitalis-cyan/10 flex items-center justify-center border border-vitalis-cyan/20">
                <Heart size={20} className="text-vitalis-cyan" />
              </div>
              <h2 className="font-black text-2xl tracking-tighter uppercase italic">Vitalis<span className="text-vitalis-cyan font-light not-italic">AI</span></h2>
            </div>
            <p className="text-vitalis-muted text-lg max-w-sm leading-relaxed font-light">
              Pioneering the intersection of artificial neural networks and precision medicine. 
              Built for the next generation of human longevity.
            </p>
            <div className="flex gap-6 mt-10">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-vitalis-cyan/10 hover:border-vitalis-cyan/30 transition-all cursor-pointer">
                  <Activity size={20} />
               </div>
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-vitalis-cyan/10 hover:border-vitalis-cyan/30 transition-all cursor-pointer">
                  <Shield size={20} />
               </div>
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-vitalis-cyan/10 hover:border-vitalis-cyan/30 transition-all cursor-pointer">
                  <Brain size={20} />
               </div>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-mono text-vitalis-muted uppercase tracking-[0.4em] mb-10">Security_Protocol</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="hover:text-vitalis-cyan cursor-pointer transition-colors flex items-center gap-3">
                 <div className="w-1 h-1 rounded-full bg-vitalis-cyan" />
                 HIPAA_LOCKED
              </li>
              <li className="hover:text-vitalis-cyan cursor-pointer transition-colors flex items-center gap-3">
                 <div className="w-1 h-1 rounded-full bg-vitalis-cyan" />
                 NEURAL_ENCRYPT
              </li>
              <li className="hover:text-vitalis-cyan cursor-pointer transition-colors flex items-center gap-3">
                 <div className="w-1 h-1 rounded-full bg-vitalis-cyan" />
                 DECENTRALIZED_VAULT
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-mono text-vitalis-muted uppercase tracking-[0.4em] mb-10">System_Status</h4>
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-vitalis-emerald animate-pulse" />
                  <span className="text-xs font-mono tracking-widest uppercase">Core_Engine: Online</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-vitalis-emerald animate-pulse" />
                  <span className="text-xs font-mono tracking-widest uppercase">Neural_Link: Synced</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-vitalis-blue animate-pulse" />
                  <span className="text-xs font-mono tracking-widest uppercase">Backup: ACTIVE</span>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-mono text-vitalis-muted uppercase tracking-[0.3em]">© 2026 VITALIS INTELLIGENCE SYSTEMS // ALL_RIGHTS_RESERVED</p>
          <div className="flex gap-12">
             <span className="text-[10px] font-mono text-vitalis-muted uppercase hover:text-white cursor-pointer tracking-widest">Protocol_A7</span>
             <span className="text-[10px] font-mono text-vitalis-muted uppercase hover:text-white cursor-pointer tracking-widest">Terms_Of_Sync</span>
             <span className="text-[10px] font-mono text-vitalis-muted uppercase hover:text-white cursor-pointer tracking-widest">Privacy_Core</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
