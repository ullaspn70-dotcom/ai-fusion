"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Brain, Activity, Globe, HeartPulse } from "lucide-react";

const features = [
  {
    title: "Neural Diagnostics",
    desc: "Real-time analysis of physiological resonance through deep neural networks.",
    icon: Brain,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Predictive Triage",
    desc: "Advanced early detection systems identifying anomalies before manifestation.",
    icon: Zap,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Biometric Security",
    desc: "Quantum-locked decentralized data storage for hyper-secure health records.",
    icon: Shield,
    color: "from-emerald-500 to-cyan-500",
  },
  {
    title: "Global Sync",
    desc: "Instant synchronization with the worldwide VITALIS clinical network.",
    icon: Globe,
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Live Monitoring",
    desc: "High-fidelity telemetry streams directly into your personal health core.",
    icon: Activity,
    color: "from-rose-500 to-orange-500",
  },
  {
    title: "Longevity Optimization",
    desc: "Personalized AI guidance designed to maximize human biological potential.",
    icon: HeartPulse,
    color: "from-amber-500 to-yellow-500",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="relative py-40 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic">
            Engineered For <br />
            <span className="text-glow-cyan not-italic font-light">Biological Excellence.</span>
          </h2>
          <p className="text-vitalis-muted text-lg max-w-2xl mx-auto font-light">
            VITALIS AI integrates the most advanced neural technologies to create the 
            world's first predictive healthcare operating system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group glass-panel p-10 rounded-[48px] hologram-border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:from-white/[0.05] transition-all relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${feature.color} p-[1px] mb-8 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full bg-vitalis-bg rounded-[23px] flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-vitalis-muted text-sm leading-relaxed font-light">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center gap-2">
                 <span className="text-[10px] font-mono text-vitalis-cyan tracking-widest uppercase">System_Linked</span>
                 <div className="h-px flex-1 bg-vitalis-cyan/10" />
                 <div className="w-1.5 h-1.5 rounded-full bg-vitalis-cyan animate-pulse" />
              </div>

              {/* Decorative Glow */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.color} blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
