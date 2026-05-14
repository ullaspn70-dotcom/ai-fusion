"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, PhoneCall, Zap, X, Bell } from "lucide-react";

interface EmergencyOverlayProps {
  onClose: () => void;
}

export default function EmergencyOverlay({ onClose }: EmergencyOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-20 overflow-hidden"
    >
      {/* Background Red Pulse */}
      <div className="absolute inset-0 bg-[#ff2244]/20 backdrop-blur-3xl" />
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(255,34,68,0.1)_0%,transparent_70%)]" />
      <div className="hud-grid absolute inset-0 opacity-10" />

      {/* Warning Bars */}
      <div className="absolute top-0 left-0 w-full h-2 bg-v-red animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-v-red animate-pulse" />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass rounded-[60px] border-[#ff2244]/30 w-full max-w-5xl p-12 relative overflow-hidden shadow-[0_0_100px_rgba(255,34,68,0.3)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 p-4 rounded-2xl glass hover:bg-v-red/10 transition-all group"
        >
          <X className="text-v-red group-hover:rotate-90 transition-transform" />
        </button>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-v-red/10 border border-v-red/20 mb-8">
                <ShieldAlert className="text-v-red animate-bounce" size={20} />
                <span className="text-xs font-mono text-v-red tracking-[0.4em] uppercase font-bold">Protocol_Zero_Active</span>
             </div>
             <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none">
                CRITICAL <br />
                <span className="text-v-red font-light not-italic">Anomaly.</span>
             </h2>
             <p className="text-xl text-v-text/80 mb-12 leading-relaxed max-w-md font-light">
                Biometric sync detects extreme systemic stress. Automated emergency response 
                initiated. AI Triage suggests immediate cardiovascular assessment.
             </p>
             
             <div className="space-y-4">
                {[
                  "Cardiac Load: 184% Elevation",
                  "Neural Resonance: UNSTABLE",
                  "Oxygen Saturation: 89% Warning"
                ].map((alert, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-v-red/5 border border-v-red/10"
                  >
                    <div className="w-2 h-2 rounded-full bg-v-red animate-pulse" />
                    <span className="text-xs font-mono text-v-red uppercase tracking-widest">{alert}</span>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="p-10 rounded-[40px] bg-v-red text-white flex flex-col items-center justify-center text-center gap-4 shadow-2xl"
             >
                <PhoneCall size={32} className="animate-pulse" />
                <span className="text-sm font-bold tracking-widest uppercase">Contact_Clinician</span>
             </motion.button>
             
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="p-10 rounded-[40px] glass border-v-red/20 flex flex-col items-center justify-center text-center gap-4"
             >
                <Zap size={32} className="text-v-red" />
                <span className="text-sm font-bold tracking-widest uppercase">Admin_Calm_Vapor</span>
             </motion.button>

             <div className="sm:col-span-2 glass rounded-[40px] p-8 border-white/5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <Bell className="text-v-red" size={20} />
                      <span className="text-[10px] font-mono text-v-muted uppercase">V_CORE_Recommendation</span>
                   </div>
                   <ChevronRight className="text-white/20" size={16} />
                </div>
                <p className="text-sm font-light leading-relaxed">
                   Initiating deep sensory override. Please synchronize your breathing with the visual pulse 
                   until emergency units arrive at your location.
                </p>
                <div className="mt-6 h-1 w-full bg-v-red/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 30, ease: "linear" }}
                     className="h-full bg-v-red" 
                   />
                </div>
             </div>
          </div>
        </div>
        
        {/* Animated Scanline Overlay */}
        <div className="absolute top-0 left-0 w-full h-full scanline opacity-20 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}

function ChevronRight({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
