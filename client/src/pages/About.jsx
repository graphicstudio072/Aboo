import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';

const About = () => (
  <div>
    <PageHeader title="About Us" subtitle="Celebrating Kerala's rich cultural heritage since decades" icon="🏛️" />
    <div className="section-padding">
      <div className="container-custom max-w-6xl">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-display font-bold text-white mb-4">What is <span className="gold-text">Sahityotsav</span>?</h2>
            <div className="gold-divider mx-0 mb-6" />
            <p className="text-dark-100 leading-relaxed mb-4">
              Kerala Sahityotsav is a premier cultural festival that celebrates the rich literary, musical, artistic, and theatrical heritage of Kerala. The event brings together thousands of talented students and artists from across the state in a spirit of friendly competition and cultural exchange.
            </p>
            <p className="text-dark-100 leading-relaxed mb-4">
              From classical music and traditional dance forms to modern drama and literary competitions, Sahityotsav encompasses the full spectrum of Kerala's vibrant cultural traditions. It serves as a platform for young talent to showcase their abilities and for established artists to inspire the next generation.
            </p>
            <p className="text-dark-100 leading-relaxed">
              The festival is organized annually and has grown to become one of the largest cultural events in the state, attracting participants from all 14 districts of Kerala and bringing together a community of artists, educators, and culture enthusiasts.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            {[
              { icon: '🎯', title: 'Mission', desc: 'To preserve, promote, and celebrate Kerala\'s cultural heritage while providing a platform for emerging talent to shine.' },
              { icon: '👁️', title: 'Vision', desc: 'To be the premier cultural event in South India that bridges tradition and modernity in Kerala\'s artistic landscape.' },
              { icon: '💎', title: 'Values', desc: 'Excellence, Inclusivity, Tradition, Innovation, and Community are at the heart of everything we do.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 flex gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-display font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-dark-200 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* History */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-white text-center mb-3">Event <span className="gold-text">History</span></h2>
          <div className="gold-divider mb-12" />
          <div className="relative border-l-2 border-gold-500/30 pl-8 space-y-8 max-w-3xl mx-auto">
            {[
              { year: '1995', event: 'First Kerala Sahityotsav organized with 500 participants across 10 programs' },
              { year: '2000', event: 'Expanded to 30+ programs; first time held at Thiruvananthapuram' },
              { year: '2010', event: 'Reached 5,000 participants milestone; introduced digital registration' },
              { year: '2015', event: 'Silver Jubilee edition; live streaming introduced for the first time' },
              { year: '2020', event: 'Virtual edition during the pandemic; innovative digital format' },
              { year: '2025', event: 'The landmark 2025 edition with 50+ programs and 10,000+ participants' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="absolute -left-11 top-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-dark-900 text-xs font-bold">•</div>
                <div className="glass-card p-4">
                  <div className="text-gold-400 font-bold font-display">{item.year}</div>
                  <div className="text-dark-100 text-sm mt-1">{item.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Committee */}
        <div>
          <h2 className="text-3xl font-display font-bold text-white text-center mb-3">Organizing <span className="gold-text">Committee</span></h2>
          <div className="gold-divider mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Rajesh Kumar', role: 'President', org: 'Kerala Sahitya Akademi' },
              { name: 'Prof. Meena Nair', role: 'Secretary', org: 'University of Kerala' },
              { name: 'Sri. Ajay Varma', role: 'Treasurer', org: 'Cultural Affairs Dept.' },
              { name: 'Smt. Priya Menon', role: 'Joint Secretary', org: 'Kerala Arts Council' },
              { name: 'Dr. Suresh Pillai', role: 'Program Director', org: 'Thiruvananthapuram District' },
              { name: 'Sri. Vikas Thomas', role: 'Media Coordinator', org: 'Press Club Kerala' },
            ].map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <div className="font-display font-bold text-white">{member.name}</div>
                <div className="text-gold-400 text-sm font-medium mt-1">{member.role}</div>
                <div className="text-dark-300 text-xs mt-1">{member.org}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
