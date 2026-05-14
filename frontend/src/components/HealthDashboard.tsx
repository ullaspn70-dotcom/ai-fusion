"use client";

import { motion } from "framer-motion";
import { Activity, Heart, Thermometer, Wind, Zap, AlertTriangle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  val: 70 + Math.random() * 20,
}));

export default function HealthDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-6 py-20">
      {/* Main Pulse Monitor */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="md:col-span-2 glass-panel rounded-3xl p-8 hologram-border relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-vitalis-cyan/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-vitalis-cyan animate-heartbeat-cinematic" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Neural Waveform</h3>
              <span className="text-xs font-mono text-vitalis-muted uppercase tracking-widest">Real-time Telemetry</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-vitalis-emerald/10 border border-vitalis-emerald/20">
            <span className="text-vitalis-emerald font-mono text-sm">SYSTEMS_OPTIMAL</span>
          </div>
        </div>

        <div className="h-64 w-full waveform-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                dot={false}
                animationDuration={2000}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-panel p-2 rounded text-[10px] font-mono border-vitalis-cyan/30">
                        {payload[0].value?.toString().slice(0, 5)} BPM
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
          {[
            { label: "BPM", val: "72", color: "text-vitalis-cyan" },
            { label: "O2", val: "98%", color: "text-vitalis-blue" },
            { label: "TEMP", val: "36.6°", color: "text-vitalis-emerald" },
            { label: "STRESS", val: "LOW", color: "text-vitalis-muted" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] font-mono text-vitalis-muted mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Side HUD Widgets */}
      <div className="space-y-6">
        {/* Risk Card */}
        <motion.div 
          whileHover={{ x: 5 }}
          className="glass-panel rounded-3xl p-6 hologram-border border-vitalis-cyan/10 bg-gradient-to-br from-vitalis-cyan/5 to-transparent"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-vitalis-cyan" />
            <h4 className="font-bold text-sm tracking-widest uppercase">AI Risk Profile</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-vitalis-muted">Pathogen Alert</span>
              <span className="font-mono text-vitalis-emerald">CLEAR</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "12%" }}
                className="h-full bg-vitalis-cyan"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-vitalis-muted">Inflammation</span>
              <span className="font-mono text-vitalis-cyan">MINIMAL</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "24%" }}
                className="h-full bg-vitalis-blue"
              />
            </div>
          </div>
        </motion.div>

        {/* Emergency Mode Trigger (Demo) */}
        <div className="glass-panel rounded-3xl p-6 border-red-500/20 group cursor-pointer hover:bg-red-500/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-red-500 text-sm">EMERGENCY_LINK</h4>
              <p className="text-[10px] text-vitalis-muted uppercase tracking-widest mt-1">Immediate Medical Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
