
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Priority, KanbanStatus } from '../types';

interface KanbanCardProps {
  ticket: Ticket;
  onMove?: (id: string, status: KanbanStatus) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ ticket, onMove }) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoveMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityStyles = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      case Priority.HIGH: return 'bg-orange-500/20 text-orange-500 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
      case Priority.MEDIUM: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('ticketId', ticket.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleMoveClick = (e: React.MouseEvent, status: KanbanStatus) => {
    e.stopPropagation();
    onMove?.(ticket.id, status);
    setShowMoveMenu(false);
  };

  const SimpleUserIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  );

  const moveOptions = [
    { label: 'New Request', status: KanbanStatus.NEW, color: 'text-blue-400' },
    { label: 'In Progress', status: KanbanStatus.IN_PROGRESS, color: 'text-yellow-400' },
    { label: 'Repaired', status: KanbanStatus.REPAIRED, color: 'text-emerald-400' },
    { label: 'Scrap/Archive', status: KanbanStatus.SCRAP, color: 'text-red-400' },
  ].filter(opt => opt.status !== ticket.status);

  return (
    <motion.div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      className={`group relative p-5 rounded-[2rem] glass border transition-all cursor-grab active:cursor-grabbing ${
        ticket.isOverdue ? 'border-red-500/40 ring-1 ring-red-500/20' : 'border-white/10'
      } bg-white/[0.02] overflow-visible ${showMoveMenu ? 'z-[100]' : 'z-10'}`}
    >
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-10 blur-xl transition-opacity pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-[30]">
        <div className="flex items-center space-x-1.5" ref={menuRef}>
          <span className="text-[10px] font-black jetbrains bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-tighter">
            {ticket.id}
          </span>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMoveMenu(!showMoveMenu); }}
              className={`p-1.5 rounded-lg transition-all border ${showMoveMenu ? 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'text-slate-500 bg-white/5 border-white/10 hover:border-white/30'}`}
            >
              <svg className={`w-3 h-3 transform transition-transform duration-300 ${showMoveMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {showMoveMenu && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="absolute top-10 left-0 w-56 bg-[#0a1929] border-2 border-white/20 rounded-2xl p-2 z-[200] shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-3xl" onClick={(e) => e.stopPropagation()}>
                  <div className="px-3 py-2.5 border-b border-white/10 mb-2"><p className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">Quick Relocate</p></div>
                  <div className="space-y-1.5">
                    {moveOptions.map((opt) => (
                      <button key={opt.status} onClick={(e) => handleMoveClick(e, opt.status)} className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/10 transition-all flex items-center space-x-4 group/opt border border-transparent hover:border-white/10">
                        <div className={`w-2.5 h-2.5 rounded-full bg-current ${opt.color} shadow-[0_0_10px_currentColor]`}></div>
                        <span className="text-[11px] font-black text-slate-200 group-hover/opt:text-white uppercase tracking-widest">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.span animate={ticket.priority === Priority.CRITICAL || ticket.priority === Priority.HIGH ? { opacity: [0.6, 1, 0.6] } : {}} transition={{ duration: 2, repeat: Infinity }} className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${getPriorityStyles(ticket.priority)}`}>
          {ticket.priority}
        </motion.span>
      </div>

      <div className="mb-5 relative z-10">
        <div className="flex items-center space-x-2 mb-1">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
          </div>
          <h4 className="text-white font-bold text-xs group-hover:text-cyan-400 transition-colors truncate">{ticket.equipmentName}</h4>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl border border-white/10 bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
            <SimpleUserIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">{ticket.technician.name}</span>
            <span className="text-[8px] text-slate-500 jetbrains lowercase">assigned</span>
          </div>
        </div>
        {ticket.isOverdue && (
           <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[8px] font-black text-red-500 jetbrains">LATE</span>
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default KanbanCard;
