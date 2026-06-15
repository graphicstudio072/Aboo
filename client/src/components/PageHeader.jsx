import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, icon }) => (
  <div className="page-header">
    <div className="page-header-bg" />
    <div className="relative z-10 container-custom text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl lg:text-6xl font-display font-bold mb-4 gold-text"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-dark-100 text-lg max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 }} className="gold-divider mt-6" />
    </div>
  </div>
);

export default PageHeader;
