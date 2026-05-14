import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vitalis: {
          bg: "#02040a",
          surface: "#050a14",
          card: "#0a0f1e",
          border: "#1a2436",
          text: "#f8fafc",
          muted: "#94a3b8",
          cyan: "#06b6d4",
          "cyan-glow": "#22d3ee",
          blue: "#2563eb",
          "blue-glow": "#60a5fa",
          red: "#dc2626",
          "red-glow": "#f87171",
          emerald: "#10b981",
        },
      },
      backgroundImage: {
        "medical-gradient": "radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        "hologram-scanline": "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(6, 182, 212, 0.03) 2px, transparent 3px)",
        "emergency-gradient": "radial-gradient(circle at center, rgba(220, 38, 38, 0.1) 0%, transparent 80%)",
      },
      animation: {
        "float-infinite": "float 8s ease-in-out infinite",
        "pulse-cyan": "pulseCyan 2s ease-in-out infinite",
        "hologram-flicker": "flicker 4s linear infinite",
        "spin-slow": "spin 12s linear infinite",
        "heartbeat-cinematic": "heartbeat 2s ease-in-out infinite",
        "glitch": "glitch 0.3s cubic-bezier(.25,.46,.45,.94) both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-30px) scale(1.02)" },
        },
        pulseCyan: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)" },
          "50%": { boxShadow: "0 0 50px rgba(6, 182, 212, 0.5)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "3%, 97%": { opacity: "0.95" },
          "5%, 95%": { opacity: "1" },
          "50%": { opacity: "0.9" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "14%": { transform: "scale(1.1)", opacity: "1" },
          "28%": { transform: "scale(1)", opacity: "0.8" },
          "42%": { transform: "scale(1.05)", opacity: "0.9" },
          "70%": { transform: "scale(1)", opacity: "0.8" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
