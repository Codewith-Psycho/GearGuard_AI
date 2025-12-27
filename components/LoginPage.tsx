
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsAuthenticating(true);
    
    // Simulate system boot-up sequence
    const sequences = [
      "Accessing Core Neural Network...",
      "Syncing Telemetry Channels...",
      "Decrypting Asset Matrix...",
      `Welcome, Admin ${username.toUpperCase()}`
    ];

    sequences.forEach((text, index) => {
      setTimeout(() => {
        setStep(index);
        if (index === sequences.length - 1) {
          setTimeout(() => onLogin(username), 800);
        }
      }, index * 800);
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a1929]">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00d4ff22 1px, transparent 1px), linear-gradient(90deg, #00d4ff22 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticating ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="w-full max-w-md glass p-10 rounded-[3rem] border border-white/10 relative z-10 shadow-[0_0_100px_rgba(0,212,255,0.1)]"
          >
            <div className="text-center mb-10">
              <motion.div 
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent tracking-tighter mb-2"
              >
                GEARGUARD AI
              </motion.div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Intelligent Maintenance Matrix</p>
              
              <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-4">
                Authentication Required
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Operator Identity</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    placeholder="Enter your name"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Secure Key</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-cyan-500 text-slate-900 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg mt-4"
              >
                Secure Access
              </motion.button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-4">Node: MH-HQ-01</p>
              <div className="flex justify-center space-x-3">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse [animation-delay:200ms]"></div>
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse [animation-delay:400ms]"></div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="authenticating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center relative z-10"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full mx-auto mb-8 shadow-[0_0_50px_rgba(0,212,255,0.2)]"
            />
            <motion.p 
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 font-bold jetbrains tracking-tighter"
            >
              { [
                "Accessing Core Neural Network...",
                "Syncing Telemetry Channels...",
                "Decrypting Asset Matrix...",
                `Welcome, Admin ${username.toUpperCase()}`
              ][step] }
            </motion.p>
            <div className="mt-8 h-1 w-64 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step + 1) * 25}%` }}
                className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(0,212,255,0.5)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
