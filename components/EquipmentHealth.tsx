
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const MOCK_HEALTH = [
  { name: 'CNC-3', health: 15, prediction: 'Failure in 72h', status: 'critical', history: [10, 15, 12, 18, 14, 15] },
  { name: 'PRESS-1', health: 88, prediction: 'Stable', status: 'good', history: [80, 82, 85, 88, 87, 88] },
  { name: 'AIR-C', health: 72, prediction: 'Service in 12d', status: 'warn', history: [75, 73, 70, 72, 71, 72] },
  { name: 'ROBOT-A', health: 95, prediction: 'Optimal', status: 'good', history: [90, 92, 94, 95, 95, 95] },
  { name: 'BELT-4', health: 54, prediction: 'Check sensors', status: 'warn', history: [65, 60, 58, 55, 54, 54] },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a2b3c] p-5 rounded-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md pointer-events-none z-[100]">
        <p className="text-white font-bold text-sm mb-2 jetbrains">{label}</p>
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${data.status === 'critical' ? 'bg-red-500' : data.status === 'warn' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
          <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">{data.prediction}</p>
        </div>
        <p className="text-slate-300 text-[10px] mt-2 jetbrains">Reliability Index: <span className="text-white font-bold">{data.health}%</span></p>
      </div>
    );
  }
  return null;
};

const EquipmentHealth: React.FC = () => {
  return (
    <div className="h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-[3rem] border border-white/10 h-full flex flex-col relative"
      >
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center space-x-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,1)]"></span>
              <span>Predictive Asset Intelligence</span>
            </h3>
            <p className="text-slate-400 text-xs">Dynamic telemetry assessment</p>
          </div>
          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} 
              whileTap={{ scale: 0.95 }}
              className="glass px-4 py-1.5 rounded-xl text-[9px] text-white font-bold uppercase tracking-widest border border-white/10"
            >
              Audit
            </motion.button>
          </div>
        </div>

        <div className="flex-1 min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={MOCK_HEALTH} 
              margin={{ top: 0, right: 10, left: -20, bottom: 20 }}
            >
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }} 
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 100 }}
                position={{ y: 50 }}
              />
              <Bar dataKey="health" radius={[12, 12, 6, 6]} barSize={50}>
                {MOCK_HEALTH.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === 'critical' ? '#ff0055' : entry.status === 'warn' ? '#ff6b35' : '#00ff88'} 
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default EquipmentHealth;
