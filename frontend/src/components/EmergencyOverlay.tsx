"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ShieldAlert, Phone, MapPin, Activity, Zap, Siren } from "lucide-react";

interface EmergencyOverlayProps {
  onClose: () => void;
}

export default function EmergencyOverlay({ onClose }: EmergencyOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
    >
      {/* Cinematic Red Backdrop */}
      <div className="absolute inset-0 bg-[#0a0202]/95 backdrop-blur-2xl" />
      <div className="absolute inset-0 emergency-glow opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Warning Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
               key={i}
               initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 0 }}
               animate={{ y: "-10%", opacity: [0, 0.5, 0] }}
               transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
               className="absolute w-1 h-1 bg-red-500 rounded-full"
            />
         ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="relative w-full max-w-4xl glass-panel border-red-500/30 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.3)]"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 animate-pulse" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all z-10"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Alert Left Column */}
          <div className="p-12 lg:w-2/5 bg-red-500/5 border-r border-red-500/10 flex flex-col justify-center">
            <motion.div
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(220,38,38,0.5)]"
            >
               <ShieldAlert size={40} className="text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-red-500 mb-4 tracking-tighter uppercase italic">Protocol Zero</h2>
            <p className="text-red-200/60 text-lg leading-relaxed font-light">
               CRITICAL_PHYSIOLOGICAL_ANOMALY detected. AI override active. Emergency response systems are initializing.
            </p>
            <div className="mt-8 pt-8 border-t border-red-500/10 space-y-4">
               <div className="flex items-center gap-3">
                  <Activity className="text-red-500 w-4 h-4" />
                  <span className="text-[10px] font-mono text-red-500/70 tracking-widest uppercase">Telemetry Status: UNSTABLE</span>
               </div>
               <div className="flex items-center gap-3">
                  <Zap className="text-red-500 w-4 h-4" />
                  <span className="text-[10px] font-mono text-red-500/70 tracking-widest uppercase">Neural Load: 88%</span>
               </div>
            </div>
          </div>

          {/* Actions Right Column */}
          <div className="p-12 lg:w-3/5 space-y-8">
            <h3 className="text-xs font-mono text-red-500/50 uppercase tracking-[0.4em]">AI_RECOMMENDED_ACTIONS</h3>
            
            <div className="grid gap-4">
               {[
                  { icon: Phone, title: "Deploy Medical Unit", desc: "Dispatch closest orbital response team to localized coordinates.", color: "bg-red-500" },
                  { icon: MapPin, title: "Locate Trauma Center", desc: "Routing to St. Jude Neurological—ETA 4.2 minutes.", color: "bg-white/10" },
                  { icon: Siren, title: "Stabilize Neural Link", desc: "Activate respiratory sync protocol to lower cardiac stress.", color: "bg-white/10" }
               ].map((action, i) => (
                  <motion.div 
                     key={i}
                     initial={{ x: 20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.2 + i*0.1 }}
                     className="group flex items-center gap-5 p-5 rounded-2xl glass-panel border-white/5 hover:border-red-500/30 transition-all cursor-pointer"
                  >
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                        <action.icon size={20} className={action.color === 'bg-red-500' ? 'text-white' : 'text-red-500'} />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-sm text-white group-hover:text-red-500 transition-colors">{action.title}</h4>
                        <p className="text-[11px] text-red-200/40 mt-1">{action.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>

            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full py-5 bg-red-600 text-white font-bold rounded-2xl shadow-2xl shadow-red-600/30 text-sm tracking-[0.2em] uppercase"
            >
               Confirm_All_Countermeasures
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
