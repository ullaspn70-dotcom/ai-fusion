"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, Siren, X } from "lucide-react";

interface EmergencyOverlayProps {
  onClose: () => void;
}

export default function EmergencyOverlay({ onClose }: EmergencyOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-vitalis-red/10 backdrop-blur-md"
    >
      {/* Background Pulsing */}
      <div className="absolute inset-0 emergency-glow pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-panel rounded-[40px] border-vitalis-red/40 p-10 max-w-2xl w-full relative z-10 text-center"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <X size={24} />
        </button>

        <motion.div 
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          className="w-24 h-24 rounded-3xl bg-vitalis-red/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(220,38,38,0.3)]"
        >
          <AlertTriangle className="w-12 h-12 text-vitalis-red" />
        </motion.div>

        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-vitalis-red to-white bg-clip-text text-transparent">
          CRITICAL_EMERGENCY_DETECTED
        </h2>
        
        <p className="text-vitalis-muted mb-10 text-lg">
          AI analysis indicates immediate cardiovascular risk. Emergency services have been 
          synchronized with your current GPS telemetry.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="tel:911"
            className="flex items-center justify-center gap-3 px-8 py-5 bg-vitalis-red text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)]"
          >
            <Phone size={20} />
            CALL EMERGENCY
          </motion.a>
          
          <button className="flex items-center justify-center gap-3 px-8 py-5 glass-panel border-vitalis-red/30 text-vitalis-red font-bold rounded-2xl">
            <Siren size={20} />
            LOCATE CLINICS
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
          {[
            { label: "Status", val: "Urgently Active", color: "text-vitalis-red" },
            { label: "Confidence", val: "99.2%", color: "text-white" },
            { label: "Wait Time", val: "4m 20s", color: "text-white" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] font-mono text-vitalis-muted mb-1 uppercase tracking-widest">{item.label}</p>
              <p className={`text-sm font-bold ${item.color}`}>{item.val}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
