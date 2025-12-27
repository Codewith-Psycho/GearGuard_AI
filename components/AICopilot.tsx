
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../services/geminiService';

const AICopilot: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "System online. CNC-Alpha 3 telemetry shows 85% vibration variance. Immediate lubrication recommended to avoid spindle failure." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    const response = await getAIResponse(userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <div className="h-full flex flex-col glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl no-scrollbar">
      <div className="p-6 border-b border-white/5 bg-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <div className="flex items-center space-x-4 mb-4">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 10px rgba(0,212,255,0.1)", "0 0 20px rgba(157,78,221,0.2)", "0 0 10px rgba(0,212,255,0.1)"],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-600 flex items-center justify-center text-xl"
          >
            🤖
          </motion.div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">GearGuard AI</h3>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Co-Pilot Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.2)' }}
            className="py-2 px-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[8px] text-cyan-400 font-bold uppercase tracking-widest transition-all"
          >
            Prioritize
          </motion.button>
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(157, 78, 221, 0.2)' }}
            className="py-2 px-3 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl text-[8px] text-fuchsia-400 font-bold uppercase tracking-widest transition-all"
          >
            Predict
          </motion.button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-black/10">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] p-4 rounded-3xl text-[11px] leading-relaxed ${
                m.role === 'ai' 
                  ? 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none' 
                  : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-50 rounded-tr-none'
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
              <div className="flex space-x-1.5">
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-white/5 border-t border-white/5">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI..."
            className="w-full bg-[#0a1929] border border-white/10 rounded-2xl py-3 px-4 text-[11px] focus:outline-none focus:border-cyan-500/50 transition-all pr-12 group-hover:border-white/20"
          />
          <button 
            onClick={handleSend}
            className="absolute right-1.5 top-1.5 w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-900 shadow-lg hover:bg-cyan-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
      
      <div className="p-6 border-t border-white/5 space-y-3 bg-white/5">
        <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Telemetry Snap</h4>
        {[
          { name: 'CNC-ALPHA', health: 85, color: 'from-cyan-400 to-blue-500', icon: '⚡' },
          { name: 'PRESS-P4', health: 42, color: 'from-orange-500 to-red-600', icon: '🔥' }
        ].map((machine) => (
          <div key={machine.name}>
            <div className="flex justify-between items-center text-[9px] mb-1">
              <span className="text-slate-400 font-bold jetbrains flex items-center">
                <span className="mr-1.5 text-[10px]">{machine.icon}</span> {machine.name}
              </span>
              <span className={`font-bold jetbrains ${machine.health < 50 ? 'text-red-500' : 'text-cyan-400'}`}>{machine.health}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${machine.health}%` }}
                className={`h-full bg-gradient-to-r ${machine.color}`}
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICopilot;
