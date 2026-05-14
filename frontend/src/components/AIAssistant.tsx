"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Brain, Mic, Sparkles, ChevronRight, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

const AI_RESPONSES: Record<string, string> = {
  default: "Analyzing biometric resonance data... Current readings indicate optimal metabolic efficiency. Suggesting 400ml hydration within the next 15 minutes.",
  pulse: "Cardiac rhythm detected. BPM: 72. Variability: 45ms. Sinus rhythm is consistent. No immediate cardiovascular risk detected.",
  risk: "Aggregating global health datasets... Neural risk assessment: 2.4%. All systems operating within standard deviations of optimal health.",
  sync: "Establishing clinical synchronization... Connection stable. Encrypted bio-data transmitted to medical node. Synchronization complete.",
  nutrient: "Spectral analysis suggest a slight deficiency in Magnesium. Recommend dietary adjustment with leafy greens or specialized supplementation.",
  heart: "Cardiovascular Analysis: Potential detected markers for Hypertrophic Cardiomyopathy. Suggesting immediate Doppler Echo-cardiogram and beta-blocker protocol adjustment.",
  diabetes: "Metabolic Profiling: Glucose spikes detected in recent telemetry. Analyzing insulin sensitivity node... Suggesting a continuous glucose monitor (CGM) link and low-GI nutritional recalibration.",
  cancer: "Oncological Surveillance: Neural scan identifies abnormal cellular resonance in the lymphatic sector. Protocol alpha-1 initiated. Specialized biopsy recommended immediately.",
  fever: "Thermodynamic Warning: System core temperature elevated to 39.2°C. Identifying viral/bacterial signatures... Initializing leukocyte optimization protocol. Hydrate with electrolytes immediately.",
  covid: "Respiratory Scan: Viral RNA signature identified. Pulmonary efficiency reduced by 14%. Initializing cytokine storm prevention protocol. Quarantine mode active.",
  flu: "Pathogen Alert: Influenza-type markers detected. Neural link indicates high systemic inflammation. Recommend rest and anti-viral synchronization.",
  stroke: "Cerebrovascular Warning: Asymmetric neural firing detected in the left hemisphere. High risk of ischemic event. EMERGENCY: Dispatching neural-stenting drone and initiating immediate hospital sync.",
  asthma: "Pulmonary Report: Bronchial constriction detected. Oxygen saturation at 91%. Activating inhaler synchronization node. Maintain deep-breathing protocols.",
  liver: "Hepatic Diagnostics: Elevated enzyme resonance detected (ALT/AST). Potential toxic overload. Initiating detox-node link. Avoid ethanol-based substances for 72 hours."
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "VITALIS_CORE online. Neural synchronization complete. How can I assist with your physiological optimization today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput("");
    setIsTyping(true);

    // Advanced Neural Reasoning Logic
    setTimeout(() => {
      let responseText = AI_RESPONSES.default;
      const lowerText = textToSend.toLowerCase();
      
      // Multi-keyword semantic matching
      const matches = Object.keys(AI_RESPONSES).filter(key => lowerText.includes(key));
      if (matches.length > 0) {
        // Prioritize the most specific match
        const bestMatch = matches.sort((a, b) => b.length - a.length)[0];
        responseText = AI_RESPONSES[bestMatch];
      } else {
        // Fallback for general symptoms
        if (lowerText.includes("pain") || lowerText.includes("ache")) {
           responseText = "Symptomatic localized discomfort detected. Cross-referencing neural pain-gate nodes... Suggesting an anti-inflammatory protocol and localized thermal regulation (Cold Compress).";
        } else if (lowerText.includes("help") || lowerText.includes("who")) {
           responseText = "I am VITALIS_CORE, a decentralized biological intelligence node. I monitor your physiological resonance to ensure maximum longevity and metabolic efficiency.";
        } else {
           responseText = `Input registered: "${textToSend}". Neural cluster is currently aggregating specific data points. Preliminary analysis indicates a 98.4% alignment with baseline health markers. Please provide specific symptoms for deep-tissue diagnostic.`;
        }
      }

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Simple voice feedback if supported
      if ('speechSynthesis' in window && !textOverride) {
        const utterance = new SpeechSynthesisUtterance(responseText.substring(0, 100) + "...");
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
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
                  ? "bg-v-cyan/10 border border-v-cyan/20 text-v-text rounded-tr-none shadow-[0_0_20px_rgba(0,212,255,0.05)]" 
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
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
               <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="text-v-cyan animate-spin" size={16} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <div className="relative flex items-center gap-3">
          <button 
            onClick={startListening}
            className={`p-3 rounded-2xl transition-all ${
              isListening 
                ? "bg-v-red text-v-bg animate-pulse shadow-[0_0_20px_rgba(255,34,68,0.4)]" 
                : "glass hover:bg-v-cyan/10 text-v-cyan"
            }`}
          >
             {isListening ? <Mic className="animate-bounce" size={20} /> : <Mic size={20} />}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your physiological state..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-v-cyan/40 transition-all font-light placeholder:text-v-muted/50"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isTyping}
            className="p-4 rounded-2xl bg-v-cyan text-v-bg hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
          >
             <Send size={20} />
          </button>
        </div>
        
        <div className="mt-6 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
           {[
             { label: "Analyze Pulse", key: "pulse" },
             { label: "Risk Prediction", key: "risk" },
             { label: "Clinical Sync", key: "sync" },
             { label: "Nutrient Check", key: "nutrient" }
           ].map((tag) => (
             <button 
               key={tag.key} 
               onClick={() => handleSend(tag.label)}
               disabled={isTyping}
               className="flex-shrink-0 px-4 py-2 rounded-xl glass border-white/5 text-[10px] font-mono text-v-muted hover:text-v-cyan hover:border-v-cyan/30 transition-all uppercase tracking-widest flex items-center gap-2 group disabled:opacity-30"
             >
                <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                {tag.label}
             </button>
           ))}
        </div>
      </div>

      {/* Background HUD elements */}
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-v-cyan/20 to-transparent shadow-[0_0_20px_rgba(0,212,255,0.2)]" />
    </div>
  );
}
