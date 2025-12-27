
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  children?: React.ReactNode;
  pulse?: boolean;
}> = ({ title, value, subtitle, gradient, children, pulse }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
    className="relative p-7 rounded-[2rem] glass border border-white/10 overflow-hidden flex flex-col justify-between h-48 group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
    
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{subtitle}</p>
        <h3 className={`text-4xl font-bold tracking-tight jetbrains ${pulse ? 'text-red-500' : 'text-white'}`}>
          {value}
          {pulse && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="ml-2 text-xl">●</motion.span>}
        </h3>
      </div>
      <div className="w-20 h-20">
        {children}
      </div>
    </div>

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{title}</span>
        <span className="text-[9px] text-cyan-400 jetbrains font-bold">+12%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${gradient} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
        ></motion.div>
      </div>
    </div>
  </motion.div>
);

const StatCards: React.FC = () => {
  const healthData = [{ value: 85 }, { value: 15 }];
  const PIE_COLORS = ['#00d4ff', 'rgba(255,255,255,0.05)'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 mb-10">
      <StatCard 
        title="Overall Reliability" 
        value="85%" 
        subtitle="Health Index" 
        gradient="from-cyan-400 to-blue-600"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={healthData}
              innerRadius={24}
              outerRadius={34}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {healthData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </StatCard>

      <StatCard 
        title="High Priority" 
        value="12" 
        subtitle="Active Issues" 
        gradient="from-red-500 to-orange-500"
        pulse={true}
      >
        <div className="flex items-end justify-center space-x-1.5 h-full pt-4">
          {[40, 70, 45, 90, 60, 80].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              className="w-2.5 bg-gradient-to-t from-red-500/20 to-red-500 rounded-full"
            ></motion.div>
          ))}
        </div>
      </StatCard>

      <StatCard 
        title="Latency Tracking" 
        value="2.5h" 
        subtitle="Avg Response" 
        gradient="from-purple-500 to-fuchsia-500"
      >
        <svg viewBox="0 0 100 50" className="w-full h-full text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            d="M5 45 Q 25 5, 50 35 T 95 10"
          />
        </svg>
      </StatCard>
    </div>
  );
};

export default StatCards;
