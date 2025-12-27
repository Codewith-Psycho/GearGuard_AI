
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from '../constants';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  user: string;
  onLogout: () => void;
  onOpenAccount: () => void;
}

type UserStatus = 'online' | 'away' | 'dnd';

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout,
  onOpenAccount 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [status, setStatus] = useState<UserStatus>('online');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: 'Dashboard', icon: ICONS.Dashboard },
    { name: 'Equipment', icon: ICONS.Equipment },
    { name: 'Teams', icon: ICONS.Teams },
    { name: 'Requests', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { name: 'Calendar', icon: ICONS.Calendar },
    { name: 'Reports', icon: ICONS.Reports },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (s: UserStatus) => {
    switch (s) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'dnd': return 'bg-rose-500';
    }
  };

  const handleAccountDetails = () => {
    onOpenAccount();
    setShowProfileMenu(false);
  };

  const handleSecureExit = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  const SimpleUserIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  );

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center space-y-6"
          >
            <motion.div 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="h-1 w-64 bg-cyan-500/20 overflow-hidden"
            >
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1, repeat: Infinity }} className="w-1/2 h-full bg-cyan-500" />
            </motion.div>
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Executing Secure Shutdown Sequence...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={{ width: isCollapsed ? 100 : 280 }}
        className="h-screen glass border-r border-white/10 flex flex-col fixed left-0 top-0 z-[150] transition-all duration-500 ease-in-out"
      >
        <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6`}>
          {!isCollapsed && (
            <motion.div 
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent tracking-tighter"
            >
              GEARGUARD
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all shadow-lg"
          >
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            )}
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <motion.button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-5'} px-5 py-4 rounded-2xl transition-all relative group ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,212,255,0.15)]' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className={`${isActive ? 'text-cyan-400' : 'group-hover:text-white transition-colors'}`}>
                  <item.icon />
                </div>
                {!isCollapsed && (
                  <span className={`font-bold text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {item.name}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="p-8 mt-auto relative z-[200]" ref={menuRef}>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: -20 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute bottom-full left-4 right-4 bg-[#0d1e31] border-2 border-white/20 rounded-[2.5rem] p-5 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] z-[300] backdrop-blur-3xl overflow-hidden"
              >
                <div className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.3em] mb-4 px-2">System Profile</div>
                <div className="space-y-2 mb-5">
                  {(['online', 'away', 'dnd'] as UserStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s); setShowProfileMenu(false); }}
                      className={`w-full flex items-center space-x-4 p-3 rounded-2xl transition-all ${
                        status === s 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(s)} ${status === s ? 'shadow-[0_0_12px_currentColor]' : ''}`}></div>
                      <span className="text-[11px] font-black uppercase tracking-widest">{s}</span>
                    </button>
                  ))}
                </div>
                <div className="h-[1px] bg-white/10 mb-3"></div>
                <div className="space-y-1">
                  <button onClick={handleAccountDetails} className="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/opt">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/opt:border-cyan-500/30 transition-colors text-slate-500 group-hover/opt:text-cyan-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover/opt:text-white uppercase tracking-widest">Account Details</span>
                  </button>
                  <button onClick={handleSecureExit} className="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-rose-500/10 transition-all group/logout">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/logout:border-rose-500/30 transition-colors text-slate-500 group-hover/logout:text-rose-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover/logout:text-rose-500 uppercase tracking-widest">Secure Exit</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center cursor-pointer transition-all ${isCollapsed ? 'justify-center' : 'space-x-4'} p-3 rounded-3xl border ${showProfileMenu ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_30px_rgba(0,212,255,0.1)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20'}`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl border border-white/10 bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                <SimpleUserIcon />
              </div>
              <motion.div 
                animate={status === 'online' ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(status)} rounded-full border-[3px] border-[#0a1929] shadow-lg`}
              ></motion.div>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-[11px] font-black truncate text-white uppercase tracking-tight">{user.toUpperCase() || 'ANONYMOUS'}</div>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-[8px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-black uppercase tracking-tighter">
                    Admin Core
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${status === 'online' ? 'text-emerald-400' : 'text-slate-500'}`}>{status}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
