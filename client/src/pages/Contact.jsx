import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

const Contact = () => (
  <div>
    <div className="page-header">
      <div className="page-header-bg" />
      <div className="relative z-10 container-custom text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-display font-bold mb-4 gold-text">
          Contact Us
        </motion.h1>
        <p className="text-dark-100 text-lg">Get in touch with the organizing committee</p>
        <div className="gold-divider mt-6" />
      </div>
    </div>
    <div className="section-padding">
      <div className="container-custom max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Reach Out to Us</h2>
            <p className="text-dark-200">For queries about programs, registrations, schedules, or results, please contact the organizing committee of Kerala Sahityotsav 2025.</p>
            <div className="space-y-4">
              {[
                { icon: <FiMapPin className="text-gold-500 text-xl" />, title: 'Venue', desc: 'Tagore Theatre, Thiruvananthapuram, Kerala 695001' },
                { icon: <FiPhone className="text-gold-500 text-xl" />, title: 'Phone', desc: '+91 471 2345 678' },
                { icon: <FiMail className="text-gold-500 text-xl" />, title: 'Email', desc: 'info@sahityotsav.com' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 flex items-start gap-4">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-white font-medium text-sm">{item.title}</div>
                    <div className="text-dark-200 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium text-dark-200 mb-3">Follow Us</div>
              <div className="flex gap-3">
                {[FiFacebook, FiInstagram, FiYoutube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-dark-200 hover:bg-gold-500/20 hover:text-gold-400 transition-all">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h2 className="text-xl font-display font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="input-dark" placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="input-dark" placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="input-dark" placeholder="Subject of your message" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="textarea-dark" rows={5} placeholder="Your message..." />
              </div>
              <button type="submit" className="btn-gold w-full justify-center">Send Message</button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
