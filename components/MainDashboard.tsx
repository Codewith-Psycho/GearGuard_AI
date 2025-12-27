
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import StatCards from './StatCards';
import KanbanBoard from './KanbanBoard';
import AICopilot from './AICopilot';
import EquipmentHealth from './EquipmentHealth';
import { KanbanStatus, Priority, Ticket, Notification } from '../types';

interface MainDashboardProps {
  user: string;
  onLogout: () => void;
}

const SimpleUserIcon = ({ size = "w-12 h-12" }: { size?: string }) => (
  <div className={`${size} rounded-2xl border border-white/10 bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner`}>
    <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  </div>
);

// --- MOCK DATA ---
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'GG-001',
    equipmentName: 'CNC Mill - Alpha 3',
    technician: { name: 'Priya P.', avatar: 'simple', status: 'online' },
    priority: Priority.CRITICAL,
    status: KanbanStatus.NEW,
    isOverdue: true,
    createdAt: '2h ago'
  },
  {
    id: 'GG-002',
    equipmentName: 'Hydraulic Press P4',
    technician: { name: 'Vikram S.', avatar: 'simple', status: 'online' },
    priority: Priority.HIGH,
    status: KanbanStatus.IN_PROGRESS,
    isOverdue: false,
    createdAt: '5h ago'
  },
  {
    id: 'GG-003',
    equipmentName: 'Air Compressor C2',
    technician: { name: 'Priya P.', avatar: 'simple', status: 'online' },
    priority: Priority.MEDIUM,
    status: KanbanStatus.NEW,
    isOverdue: false,
    createdAt: '1d ago'
  },
  {
    id: 'GG-004',
    equipmentName: 'Assembly Line Belt 2',
    technician: { name: 'Amit K.', avatar: 'simple', status: 'offline' },
    priority: Priority.LOW,
    status: KanbanStatus.REPAIRED,
    isOverdue: false,
    createdAt: '3h ago'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'SYSTEM ALERT',
    message: 'CNC-Alpha 3 vibration variance exceeds threshold (85%).',
    time: '2m ago',
    type: 'error',
    isRead: false
  },
  {
    id: '2',
    title: 'SCHEDULE UPDATE',
    message: 'Technician Priya P. has started maintenance on GG-001.',
    time: '45m ago',
    type: 'info',
    isRead: true
  }
];

const MOCK_EQUIPMENT = [
  { id: 'EQ-101', name: 'CNC-Alpha 3', status: 'Operational', health: 85, nextService: '24 Oct', load: '72%' },
  { id: 'EQ-102', name: 'Press-P4', status: 'Maintenance', health: 42, nextService: 'Today', load: '0%' },
  { id: 'EQ-103', name: 'Compressor-C2', status: 'Operational', health: 91, nextService: '12 Nov', load: '45%' },
  { id: 'EQ-104', name: 'Robot-Arm-X', status: 'Standby', health: 98, nextService: '01 Dec', load: '12%' },
];

const MOCK_TEAMS = [
  { name: 'Priya Patel', role: 'Senior Tech', status: 'On Duty', workload: 82 },
  { name: 'Vikram Singh', role: 'Mechanical', status: 'Break', workload: 45 },
  { name: 'Amit Kumar', role: 'Electrical', status: 'On Duty', workload: 60 },
  { name: 'Ananya Iyer', role: 'AI Integration', status: 'Off Duty', workload: 0 },
];

const MainDashboard: React.FC<MainDashboardProps> = ({ user, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const moveTicket = (ticketId: string, newStatus: KanbanStatus) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    ));
  };

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket: Ticket = {
      id: `GG-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      equipmentName: formData.get('equipment') as string,
      technician: { name: 'Rajesh M.', avatar: 'simple', status: 'online' },
      priority: formData.get('priority') as Priority,
      status: KanbanStatus.NEW,
      isOverdue: false,
      createdAt: 'just now'
    };
    setTickets([newTicket, ...tickets]);
    
    setNotifications([{
      id: Date.now().toString(),
      title: 'TICKET CREATED',
      message: `New request ${newTicket.id} deployed for ${newTicket.equipmentName}.`,
      time: 'just now',
      type: 'info',
      isRead: false
    }, ...notifications]);
    
    setIsNewTicketModalOpen(false);
  };

  const handleAIScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const scanTicket: Ticket = {
        id: `GG-SCAN-${Math.floor(Math.random() * 99)}`,
        equipmentName: 'Anomalous Spindle Unit X1',
        technician: { name: 'AI Core', avatar: 'simple', status: 'online' },
        priority: Priority.CRITICAL,
        status: KanbanStatus.NEW,
        isOverdue: false,
        createdAt: 'Auto-detected'
      };
      setTickets([scanTicket, ...tickets]);
      setNotifications([{
        id: Date.now().toString(),
        title: 'ANOMALY DETECTED',
        message: 'Neural scan identified critical failure risk in Spindle Unit X1.',
        time: 'just now',
        type: 'error',
        isRead: false
      }, ...notifications]);
      setIsScanning(false);
    }, 2500);
  };

  const filteredTickets = tickets.filter(t => 
    t.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="pt-8">
            <StatCards />
            <div className="px-8 mb-6 mt-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center space-x-4 tracking-tight">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <span>Command Center Dashboard</span>
              </h2>
            </div>
            <KanbanBoard tickets={filteredTickets} onMoveTicket={moveTicket} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-8 min-h-[500px] mb-10">
              <div className="xl:col-span-2">
                <EquipmentHealth />
              </div>
              <div className="h-full">
                <AICopilot />
              </div>
            </div>
          </div>
        );
      case 'Equipment':
        return (
          <div className="p-10 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Asset Inventory</h1>
                <p className="text-slate-500 text-xs mt-2 jetbrains">status: real-time telemetry connected</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {MOCK_EQUIPMENT.map((eq) => (
                <motion.div whileHover={{ y: -5 }} key={eq.id} className="glass p-6 rounded-[2rem] border border-white/10 relative overflow-hidden">
                   <div className={`absolute top-0 right-0 p-3 text-[8px] font-black uppercase tracking-widest ${eq.status === 'Operational' ? 'text-emerald-400' : 'text-orange-400'}`}>{eq.status}</div>
                   <p className="text-slate-500 text-[9px] font-bold jetbrains mb-1">{eq.id}</p>
                   <h3 className="text-lg font-bold text-white mb-4">{eq.name}</h3>
                   <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[9px] mb-1">
                          <span className="text-slate-500 uppercase font-black">Reliability</span>
                          <span className="text-cyan-400 font-bold">{eq.health}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${eq.health}%` }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">Service Due</span>
                        <span className="text-white font-bold">{eq.nextService}</span>
                      </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'Teams':
        return (
          <div className="p-10 space-y-8">
            <h1 className="text-3xl font-black uppercase tracking-tight">Squad Matrix</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {MOCK_TEAMS.map((member) => (
                <div key={member.name} className="glass p-6 rounded-[2rem] border border-white/10 flex items-center space-x-6">
                  <SimpleUserIcon size="w-20 h-20" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{member.name}</h3>
                        <p className="text-cyan-400 text-[10px] uppercase font-black tracking-widest">{member.role}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black border uppercase tracking-widest ${member.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                        {member.status}
                      </span>
                    </div>
                    <div className="mt-4">
                       <div className="flex justify-between text-[9px] mb-1">
                          <span className="text-slate-500 uppercase font-black">Active Load</span>
                          <span className="text-white font-bold">{member.workload}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${member.workload}%` }}></div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Calendar':
        return (
          <div className="p-10 space-y-8 h-full flex flex-col">
            <h1 className="text-3xl font-black uppercase tracking-tight">Maintenance Ops Schedule</h1>
            <div className="flex-1 glass rounded-[3rem] border border-white/10 p-10 grid grid-cols-7 gap-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-500 tracking-widest mb-4">{day}</div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className={`h-32 rounded-2xl border border-white/5 bg-white/[0.02] p-3 relative group hover:border-cyan-500/30 transition-all ${i === 12 ? 'ring-2 ring-cyan-500/50' : ''}`}>
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-cyan-400 transition-colors">{i + 1}</span>
                  {i === 3 && <div className="mt-2 p-1.5 rounded-lg bg-red-500/20 text-red-400 text-[8px] font-bold border border-red-500/20 truncate">CNC-3 FAILURE</div>}
                  {i === 12 && <div className="mt-2 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-[8px] font-bold border border-cyan-500/20 truncate">AI SYSTEM SYNC</div>}
                  {i === 20 && <div className="mt-2 p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[8px] font-bold border border-emerald-500/20 truncate">BELT REPAIR</div>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'Reports':
        return (
          <div className="p-10 space-y-8">
            <h1 className="text-3xl font-black uppercase tracking-tight">System Performance Reports</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-64 flex flex-col justify-between">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">MTBF Analysis</h4>
                <div className="text-5xl font-black text-emerald-400">428h</div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Mean Time Between Failures has improved by 12.4% this quarter.</p>
              </div>
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-64 flex flex-col justify-between">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">OpEx Efficiency</h4>
                <div className="text-5xl font-black text-cyan-400">92.1%</div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Predictive maintenance reduced emergency spend by $14.2k.</p>
              </div>
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-64 flex flex-col justify-between">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">AI Utilization</h4>
                <div className="text-5xl font-black text-purple-400">76%</div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Autoscan accuracy reaches new peak in mechanical anomaly detection.</p>
              </div>
            </div>
          </div>
        );
      case 'Requests':
        return (
          <div className="p-10">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-black uppercase tracking-tight">Active Requests Archive</h1>
              <div className="flex space-x-2">
                 <button className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-white/5">Export CSV</button>
                 <button className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-white/5">Filter Priority</button>
              </div>
            </div>
            <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Ticket ID</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Asset</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Technician</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Severity</th>
                      <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-5 text-xs font-bold jetbrains text-cyan-400">{t.id}</td>
                        <td className="p-5 text-xs text-white">{t.equipmentName}</td>
                        <td className="p-5 text-xs text-slate-400">{t.technician.name}</td>
                        <td className="p-5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${t.priority === Priority.CRITICAL ? 'text-red-500' : 'text-slate-500'}`}>{t.priority}</span>
                        </td>
                        <td className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-600">{t.status}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a1929] text-white overflow-hidden no-scrollbar">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={onLogout}
        onOpenAccount={() => setIsAccountModalOpen(true)}
      />
      <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'md:ml-[100px]' : 'md:ml-[280px]'}`}>
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputRef={searchInputRef} onNewTicket={() => setIsNewTicketModalOpen(true)} onAIScan={handleAIScan} isScanning={isScanning} notifications={notifications} onClearNotifications={() => setNotifications([])} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-10">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="h-full">
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Account Details Modal */}
      <AnimatePresence>
        {isAccountModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAccountModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 50 }} 
              className="relative w-full max-w-2xl glass rounded-[3rem] border border-white/20 p-12 overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.1)]"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setIsAccountModalOpen(false)} className="p-3 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex items-start space-x-10 mb-12">
                <div className="relative">
                  <SimpleUserIcon size="w-32 h-32" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#0a1929] shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">{user}</h2>
                  <div className="flex space-x-3 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">Level 5 Admin</span>
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest">HQ Sector Delta</span>
                  </div>
                  <p className="text-slate-400 text-sm max-w-md leading-relaxed">System Operator responsible for high-priority asset maintenance and neural network synchronization across the GearGuard Matrix.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Security Telemetry</h4>
                   {[
                     { label: 'Neural Key', value: 'GG-AUTH-' + Math.floor(Math.random() * 999999) },
                     { label: 'Uptime', value: '184h 12m' },
                     { label: 'Sync Rate', value: '99.98%' }
                   ].map(item => (
                     <div key={item.label} className="flex justify-between border-b border-white/5 pb-3">
                       <span className="text-[10px] text-slate-500 font-bold uppercase">{item.label}</span>
                       <span className="text-xs text-white font-bold jetbrains">{item.value}</span>
                     </div>
                   ))}
                </div>
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Session Access Log</h4>
                   {[
                     { label: 'Login HQ', time: '09:42 UTC' },
                     { label: 'AI Sync', time: '10:15 UTC' },
                     { label: 'Data Ext', time: '11:04 UTC' }
                   ].map((log, i) => (
                     <div key={i} className="flex items-center space-x-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(0,212,255,0.6)]"></div>
                       <div className="flex-1 flex justify-between text-[11px]">
                         <span className="text-slate-300 font-medium">{log.label}</span>
                         <span className="text-slate-500 jetbrains">{log.time}</span>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Terminal Status</p>
                   <p className="text-xs text-cyan-400 font-bold jetbrains">CONNECTED // ENCRYPTED // SECURE</p>
                </div>
                <button 
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {isNewTicketModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewTicketModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg glass rounded-[3rem] border border-white/20 p-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"></div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Generate Request</h3>
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Equipment Identifier</label>
                  <input name="equipment" required placeholder="e.g. CNC-Alpha 4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-cyan-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority Level</label>
                  <select name="priority" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-cyan-500 outline-none transition-all appearance-none">
                    <option value={Priority.LOW} className="bg-[#0a1929]">Low</option>
                    <option value={Priority.MEDIUM} className="bg-[#0a1929]">Medium</option>
                    <option value={Priority.HIGH} className="bg-[#0a1929]">High</option>
                    <option value={Priority.CRITICAL} className="bg-[#0a1929]">Critical</option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Abort</button>
                  <button type="submit" className="flex-1 py-4 bg-cyan-500 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-105 transition-all">Deploy Ticket</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-cyan-900/20 backdrop-blur-md" />
            <div className="relative text-center">
              <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-8 shadow-[0_0_50px_rgba(0,212,255,0.4)]" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter animate-pulse">Running Neural Scan...</h2>
              <p className="text-cyan-400 font-bold jetbrains mt-4">Calibrating telemetry sensors...</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainDashboard;
