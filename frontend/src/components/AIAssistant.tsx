"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, Send, Bot, User, BrainCircuit, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

function Typewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "VITALIS AI system initialized. Neural telemetry sync complete. How can I assist with your physiological data today?" }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.ai_message || "I've processed your telemetry. Neural patterns suggest we should monitor your vitals closely."
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Fallback for demo if backend is not running
      setTimeout(() => {
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: "Neural link unstable, but I've captured your symptom profile. Analyzing localized physiological stress patterns now." 
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1500);
    } finally {
      setTimeout(() => setIsThinking(false), 500);
    }
  };

  return (
    <div className="glass-panel rounded-[40px] hologram-border flex flex-col h-[650px] w-full max-w-2xl mx-auto overflow-hidden relative group shadow-2xl">
      {/* HUD Background Decorations */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <BrainCircuit className="w-32 h-32 text-vitalis-cyan" />
      </div>
      <div className="absolute bottom-24 left-0 w-full h-px bg-gradient-to-r from-transparent via-vitalis-cyan/20 to-transparent" />

      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-vitalis-cyan/10 flex items-center justify-center animate-pulse-cyan">
              <Bot className="w-7 h-7 text-vitalis-cyan" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-vitalis-emerald border-4 border-vitalis-bg" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight text-glow-cyan">VITALIS CORE</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vitalis-emerald animate-pulse" />
              <span className="text-[10px] font-mono text-vitalis-muted uppercase tracking-widest">Neural Link: Encrypted</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 h-6 items-end">
          {[0.4, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
            <motion.div 
              key={i}
              animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
              transition={{ duration: 1 + i*0.2, repeat: Infinity }}
              className="w-1.5 bg-vitalis-cyan/30 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === "user" ? 30 : -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.role === "user" ? "bg-vitalis-blue/20 text-vitalis-blue border border-vitalis-blue/30" : "bg-vitalis-cyan/20 text-vitalis-cyan border border-vitalis-cyan/30"
                }`}>
                  {msg.role === "user" ? <User size={20} /> : <Sparkles size={20} />}
                </div>
                <div className={`p-5 rounded-[24px] text-sm leading-relaxed shadow-xl ${
                  msg.role === "user" 
                    ? "bg-vitalis-blue/10 border border-vitalis-blue/20 rounded-tr-none text-white" 
                    : "bg-white/[0.03] border border-white/10 rounded-tl-none text-blue-50/90"
                }`}>
                  {msg.role === "assistant" && index === messages.length - 1 && !isThinking ? (
                    <Typewriter text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-vitalis-cyan/10 flex items-center justify-center border border-vitalis-cyan/20">
                  <Loader2 className="w-5 h-5 text-vitalis-cyan animate-spin" />
                </div>
                <div className="p-5 rounded-[24px] rounded-tl-none bg-white/[0.03] border border-white/10 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-vitalis-cyan animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-vitalis-cyan animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-vitalis-cyan animate-bounce" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="relative flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-2xl glass-panel text-vitalis-muted hover:text-vitalis-cyan transition-colors"
          >
            <Mic size={24} />
          </motion.button>
          <div className="relative flex-1 group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Query neural symptoms..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-vitalis-cyan/50 focus:ring-1 focus:ring-vitalis-cyan/20 transition-all placeholder:text-vitalis-muted/50"
            />
            <div className="absolute inset-0 rounded-2xl bg-vitalis-cyan/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isThinking}
            className="p-4 rounded-2xl bg-gradient-to-br from-vitalis-cyan to-vitalis-blue text-vitalis-bg shadow-lg shadow-vitalis-cyan/20 disabled:opacity-50"
          >
            <Send size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
