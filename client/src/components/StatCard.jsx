import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, color = 'gold', index = 0 }) => {
  const colors = {
    gold: 'from-gold-500/20 to-gold-500/5 border-gold-500/20 text-gold-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
    green: 'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/20 text-red-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card p-6 bg-gradient-to-br border ${colors[color]}`}
    >
      <div className="flex items-center gap-4">
        <div className={`text-3xl ${colors[color].split(' ').pop()}`}>{icon}</div>
        <div>
          <div className="text-3xl font-display font-bold text-white">{value}</div>
          <div className="text-dark-200 text-sm mt-0.5">{label}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
