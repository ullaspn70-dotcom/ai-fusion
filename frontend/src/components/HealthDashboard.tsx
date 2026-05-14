"use client";

import { motion } from "framer-motion";
import { Activity, Heart, Thermometer, Wind, Zap, AlertTriangle, ShieldCheck, ActivitySquare } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";

export default function HealthDashboard() {
  const [chartData, setChartData] = useState(Array.from({ length: 30 }, (_, i) => ({ time: i, val: 72 + Math.random() * 5 })));
  const [pulse, setPulse] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      const newVal = 70 + Math.random() * 15;
      setPulse(Math.round(newVal));
      setChartData(prev => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, val: newVal }];
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-6 py-20">
      {/* Main Pulse Monitor */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-2 glass-panel rounded-[40px] p-10 hologram-border relative overflow-hidden group shadow-2xl"
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[24px] bg-vitalis-cyan/10 flex items-center justify-center border border-vitalis-cyan/20 group-hover:animate-pulse">
              <Activity className="w-8 h-8 text-vitalis-cyan animate-heartbeat-cinematic" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Neural Telemetry</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-vitalis-emerald animate-pulse" />
                <span className="text-[10px] font-mono text-vitalis-muted uppercase tracking-[0.2em]">Live Stream Active</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="px-4 py-1.5 rounded-full bg-vitalis-emerald/10 border border-vitalis-emerald/20 mb-2">
                <span className="text-vitalis-emerald font-mono text-[10px] tracking-widest uppercase">System_Optimal</span>
             </div>
             <span className="text-xs font-mono text-vitalis-muted">LATENCY: 12ms</span>
          </div>
        </div>

        <div className="h-72 w-full waveform-container relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorVal)" 
                isAnimationActive={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-panel px-3 py-1.5 rounded-xl text-[10px] font-mono border-vitalis-cyan/30 shadow-2xl">
                        {payload[0].value?.toString().slice(0, 5)} BPM
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-white/5">
          {[
            { label: "Heart Rate", val: pulse, unit: "BPM", color: "text-vitalis-cyan", icon: Heart },
            { label: "Oxygen Sat", val: "98.4", unit: "%", color: "text-vitalis-blue", icon: Wind },
            { label: "Body Temp", val: "36.6", unit: "°C", color: "text-vitalis-emerald", icon: Thermometer },
            { label: "Stress Index", val: "0.12", unit: "LVI", color: "text-vitalis-muted", icon: ActivitySquare },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-4 rounded-3xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3 opacity-60`} />
              <p className="text-[10px] font-mono text-vitalis-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <p className={`text-2xl font-bold tracking-tighter ${stat.color}`}>{stat.val}</p>
                <span className="text-[10px] font-mono text-vitalis-muted">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Side HUD Widgets */}
      <div className="space-y-8">
        {/* Confidence Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[40px] p-8 hologram-border border-vitalis-cyan/10 bg-gradient-to-br from-vitalis-cyan/5 to-transparent shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-vitalis-cyan/10">
              <ShieldCheck className="w-5 h-5 text-vitalis-cyan" />
            </div>
            <h4 className="font-bold text-sm tracking-[0.2em] uppercase">AI Confidence</h4>
          </div>
          
          <div className="flex flex-col items-center justify-center py-4 relative">
             <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <motion.circle 
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={364.4}
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset: 364.4 * 0.02 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="text-vitalis-cyan" 
                />
             </svg>
             <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold tracking-tighter">98<span className="text-lg">%</span></span>
                <span className="text-[8px] font-mono text-vitalis-muted tracking-widest">PRECISION</span>
             </div>
          </div>
          
          <div className="mt-8 space-y-4">
             <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-vitalis-muted">Pathogen Analysis</span>
                <span className="text-vitalis-emerald">Match 1.2%</span>
             </div>
             <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-vitalis-muted">Neural Sync Rate</span>
                <span className="text-vitalis-cyan">99.9%</span>
             </div>
          </div>
        </motion.div>

        {/* Emergency Mode Trigger */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[40px] p-8 border-red-500/20 group cursor-pointer hover:bg-red-500/5 transition-all shadow-xl"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:animate-pulse border border-red-500/20">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-red-500 text-base tracking-tight uppercase">Emergency Mode</h4>
              <p className="text-[10px] text-vitalis-muted uppercase tracking-[0.2em] mt-1">Initiate Protocol Zero</p>
            </div>
          </div>
          <div className="mt-6 h-px w-full bg-red-500/10" />
          <div className="mt-6 flex justify-between items-center">
             <span className="text-[9px] font-mono text-red-500/50 uppercase tracking-widest">Auth Required</span>
             <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500" 
             />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
