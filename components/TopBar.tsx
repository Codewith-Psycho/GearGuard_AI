
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../types';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onNewTicket: () => void;
  onAIScan: () => void;
  isScanning: boolean;
  notifications: Notification[];
  onClearNotifications: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  searchInputRef, 
  onNewTicket, 
  onAIScan,
  isScanning,
  notifications,
  onClearNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-24 flex items-center justify-between px-10 sticky top-0 z-[100] bg-[#0a1929]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="relative w-[450px] group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          ref={searchInputRef}
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search equipment, tickets, or telemetry..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm group-hover:bg-white/10"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <motion.button 
            onClick={onNewTicket}
            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-cyan-500 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            New Ticket
          </motion.button>
          <motion.button 
            onClick={onAIScan}
            disabled={isScanning}
            whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 glass text-white/80 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isScanning ? 'Scanning...' : 'AI Scan'}
          </motion.button>
        </div>

        <div className="h-10 w-[1px] bg-white/10 mx-2"></div>

        <div className="relative" ref={notificationRef}>
          <div 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer group p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            {unreadCount > 0 && (
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a1929] z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              ></motion.div>
            )}
            <svg className={`w-6 h-6 transition-colors ${showNotifications ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-4 w-96 bg-[#0a1929] border border-white/20 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden z-[200] backdrop-blur-3xl ring-1 ring-white/10"
              >
                <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Alert Hub</h4>
                    <p className="text-[10px] text-slate-500 jetbrains lowercase">node: notifications_live</p>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={onClearNotifications}
                      className="text-[9px] font-black text-cyan-400 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar bg-black/40">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="text-4xl mb-4 opacity-20 grayscale">🎐</div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Active Alerts</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-5 border-b border-white/5 hover:bg-white/[0.05] transition-colors relative group/item ${!n.isRead ? 'bg-cyan-500/[0.03]' : ''}`}>
                        {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(0,212,255,0.6)]"></div>}
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-orange-500' : 'text-cyan-400'
                          }`}>{n.title}</span>
                          <span className="text-[9px] text-slate-500 font-bold jetbrains">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-5 bg-black/40 text-center border-t border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">End of Transmission</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
