"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, Send, Bot, User, BrainCircuit } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "VITALIS AI system initialized. I am monitoring your neural telemetry. How can I assist you today?" }
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
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    // Simulate AI thinking
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: "I've analyzed your input. Neural patterns suggest elevated stress levels. Recommended: 5-minute guided respiratory synchronization." 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="glass-panel rounded-3xl hologram-border flex flex-col h-[600px] w-full max-w-2xl mx-auto overflow-hidden relative group">
      {/* HUD Background Decorations */}
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <BrainCircuit className="w-24 h-24 text-vitalis-cyan" />
      </div>
      <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-vitalis-cyan/20 to-transparent" />

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-vitalis-cyan/10 flex items-center justify-center animate-pulse-cyan">
              <Bot className="w-6 h-6 text-vitalis-cyan" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-vitalis-emerald border-2 border-vitalis-bg" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">VITALIS CORE</h3>
            <span className="text-[10px] font-mono text-vitalis-muted uppercase tracking-widest">Neural Link: Active</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1.5 h-6 bg-vitalis-cyan/20 rounded-full" />
          <div className="w-1.5 h-4 bg-vitalis-cyan/40 rounded-full" />
          <div className="w-1.5 h-8 bg-vitalis-cyan/10 rounded-full" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-vitalis-blue/20 text-vitalis-blue" : "bg-vitalis-cyan/20 text-vitalis-cyan"
                }`}>
                  {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" ? "bg-vitalis-blue/10 border border-vitalis-blue/20" : "bg-white/5 border border-white/10"
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/[0.02]">
        <div className="relative flex items-center gap-3">
          <button className="p-3 rounded-xl glass-panel text-vitalis-muted hover:text-vitalis-cyan transition-colors">
            <Mic size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe physiological symptoms..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-vitalis-cyan/50 transition-all placeholder:text-vitalis-muted"
          />
          <button 
            onClick={handleSend}
            className="p-3 rounded-xl bg-vitalis-cyan text-vitalis-bg hover:scale-105 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
