import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Instagram, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const offeringsLinks = [
    { label: 'Menu',      href: '/menu' },
    { label: 'Meal Plan', href: '/meal-plan' },
    { label: 'Catering',  href: '#' },
  ];

  const othersLinks = [
    { label: 'Nutrition', href: '/nutrition' },
    { label: 'About',     href: '/about' },
    { label: 'Contact',   href: '/contact' },
  ];

  return (
    <footer className="bg-brown-900 text-brown-300">
      {/* Top accent line */}
      <div className="h-px w-full bg-orange-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-brown-700">
                <Image
                  src="/newLogo.png"
                  alt="SOOEATS"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-logo text-4xl">
                <span className="text-white">SOO</span><span className="text-orange-500">EATS</span>
              </h3>
            </div>
            <p className="text-brown-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Healthy has never tasted this good!
            </p>
          </div>

          {/* Offerings column */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-brown-500 font-semibold mb-6">
              Offerings
            </h4>
            <nav className="flex flex-col items-center md:items-start gap-3" aria-label="Offerings links">
              {offeringsLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-brown-400 hover:text-orange-400 transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Others column */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-brown-500 font-semibold mb-6">
              Others
            </h4>
            <nav className="flex flex-col items-center md:items-start gap-3" aria-label="Other links">
              {othersLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-brown-400 hover:text-orange-400 transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact column */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-brown-500 font-semibold mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-sm text-brown-400">
              <a href="tel:7059757396" className="flex items-center justify-center md:justify-start gap-3 hover:text-orange-400 transition-colors duration-200">
                <Phone className="w-4 h-4 shrink-0" />
                705-975-7396
              </a>
              <a href="mailto:sooeats1@gmail.com" className="flex items-center justify-center md:justify-start gap-3 hover:text-orange-400 transition-colors duration-200">
                <Mail className="w-4 h-4 shrink-0" />
                sooeats1@gmail.com
              </a>
              <a
                href="https://instagram.com/soo__eats_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-3 hover:text-orange-400 transition-colors duration-200"
              >
                <Instagram className="w-4 h-4 shrink-0" />
                @soo__eats_
              </a>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brown-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brown-600 uppercase tracking-widest">
            &copy; {currentYear} SOOEATS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
