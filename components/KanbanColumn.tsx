
import React, { useState } from 'react';
import { Ticket, KanbanStatus } from '../types';
import KanbanCard from './KanbanCard';
import { motion } from 'framer-motion';

interface KanbanColumnProps {
  title: string;
  status: KanbanStatus;
  tickets: Ticket[];
  glowColor: string;
  onDropTicket: (id: string, status: KanbanStatus) => void;
  isScrapZone?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tickets, glowColor, status, onDropTicket, isScrapZone }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onDropTicket(ticketId, status);
    }
  };

  const getGlowStyles = () => {
    if (!isOver) return 'border-white/5';
    switch (glowColor) {
      case 'blue': return 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.2)]';
      case 'yellow': return 'border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.2)]';
      case 'emerald': return 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
      case 'red': return 'border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      default: return 'border-white/20';
    }
  };

  const textGlow = `text-${glowColor}-400`;

  return (
    <div 
      className={`w-[320px] flex flex-col h-full rounded-[2.5rem] p-2 transition-all duration-300 border-2 border-transparent ${getGlowStyles()}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-6 px-4 pt-4">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full bg-current ${textGlow} shadow-[0_0_12px_currentColor]`}></div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
        </div>
        <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[10px] text-slate-500 font-black border border-white/10 jetbrains">
          {tickets.length.toString().padStart(2, '0')}
        </span>
      </div>
      
      <div className="flex-1 space-y-4 min-h-[450px] px-2 pb-4">
        {tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <KanbanCard ticket={ticket} onMove={onDropTicket} />
          </motion.div>
        ))}
        {tickets.length === 0 && (
          <div className={`h-32 rounded-[2rem] border-2 border-dashed flex items-center justify-center transition-colors ${
            isScrapZone ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/5 bg-white/[0.01]'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isScrapZone ? 'text-red-900' : 'text-slate-700'}`}>
              {isScrapZone ? 'Disposal Node' : 'Empty Sector'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
