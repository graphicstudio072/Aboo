import { Link } from 'react-router-dom';
import { GiLotus } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark-800 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <GiLotus className="text-dark-900 text-2xl" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold gold-text">Kerala Sahityotsav</div>
                <div className="text-dark-200 text-sm">Celebrating Cultural Renaissance</div>
              </div>
            </div>
            <p className="text-dark-200 text-sm leading-relaxed max-w-sm">
              A premier cultural festival celebrating the rich literary, musical, artistic, and theatrical heritage of Kerala. Bringing together talent from across the state.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { icon: <FiFacebook />, href: '#' },
                { icon: <FiTwitter />, href: '#' },
                { icon: <FiInstagram />, href: '#' },
                { icon: <FiYoutube />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-dark-200 hover:bg-gold-500/20 hover:text-gold-400 transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Programs', to: '/programs' },
                { label: 'Schedule', to: '/schedule' },
                { label: 'Results', to: '/results' },
                { label: 'Gallery', to: '/gallery' },
                { label: 'Downloads', to: '/downloads' },
                { label: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-dark-200 hover:text-gold-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-gold-500 mt-0.5 shrink-0" />
                <span className="text-dark-200 text-sm">Tagore Theatre, Thiruvananthapuram, Kerala 695001</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-gold-500 shrink-0" />
                <span className="text-dark-200 text-sm">+91 471 2345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-gold-500 shrink-0" />
                <span className="text-dark-200 text-sm">info@sahityotsav.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-300 text-sm">&copy; {year} Kerala Sahityotsav. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/admin" className="text-dark-300 hover:text-gold-400 text-sm transition-colors">Admin Portal</Link>
            <span className="text-dark-600">|</span>
            <a href="#" className="text-dark-300 hover:text-gold-400 text-sm transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
