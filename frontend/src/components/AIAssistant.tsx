"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Brain, Mic, Sparkles, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "VITALIS_CORE online. Neural synchronization complete. How can I assist with your physiological optimization today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: "Analyzing biometric resonance data... Current readings indicate optimal metabolic efficiency. Suggesting 400ml hydration within the next 15 minutes." 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="glass rounded-[40px] flex flex-col h-[600px] w-full max-w-2xl mx-auto overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-v-cyan/10 flex items-center justify-center relative group">
             <Brain className="text-v-cyan group-hover:scale-110 transition-transform" size={24} />
             <div className="absolute inset-0 bg-v-cyan blur-xl opacity-20" />
          </div>
          <div>
            <h3 className="font-bold tracking-tight">VITALIS_CORE_AI</h3>
            <span className="text-[9px] font-mono text-v-emerald uppercase tracking-widest">Active_Neural_Link</span>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-v-emerald animate-pulse" />
           <div className="w-2 h-2 rounded-full bg-v-cyan animate-pulse delay-75" />
           <div className="w-2 h-2 rounded-full bg-v-blue animate-pulse delay-150" />
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] p-5 rounded-[24px] ${
                msg.role === "user" 
                  ? "bg-v-cyan/10 border border-v-cyan/20 text-v-text rounded-tr-none" 
                  : "bg-white/[0.03] border border-white/5 text-v-text rounded-tl-none"
              }`}>
                <p className="text-sm leading-relaxed font-light">{msg.text}</p>
                <div className="mt-3 flex items-center gap-2">
                   <span className="text-[8px] font-mono text-v-muted uppercase">
                     {msg.role === "user" ? "Auth_Patient" : "Core_Intelligence"}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <div className="relative flex items-center gap-3">
          <button className="p-3 rounded-2xl glass hover:bg-v-cyan/10 text-v-cyan transition-all">
             <Mic size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your physiological state..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-v-cyan/40 transition-all font-light"
          />
          <button 
            onClick={handleSend}
            className="p-4 rounded-2xl bg-v-cyan text-v-bg hover:scale-105 transition-all shadow-lg"
          >
             <Send size={20} />
          </button>
        </div>
        
        <div className="mt-6 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
           {["Analyze Pulse", "Risk Prediction", "Clinical Sync", "Nutrient Check"].map((tag) => (
             <button key={tag} className="flex-shrink-0 px-4 py-2 rounded-xl glass border-white/5 text-[10px] font-mono text-v-muted hover:text-v-cyan hover:border-v-cyan/30 transition-all uppercase tracking-widest flex items-center gap-2 group">
                <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                {tag}
             </button>
           ))}
        </div>
      </div>

      {/* Background HUD elements */}
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-v-cyan/20 to-transparent" />
    </div>
  );
}
