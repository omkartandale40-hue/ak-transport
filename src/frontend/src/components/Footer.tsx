import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Truck } from "lucide-react";
import { SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="brand-gradient noise-overlay border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-sm bg-accent flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-white text-xl tracking-tight leading-none">
                  AK
                </span>
                <span className="font-display font-bold text-accent text-[11px] tracking-[0.15em] uppercase leading-none">
                  TRANSPORT
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Reliable logistics and transportation services. Moving people and
              cargo with precision and care since 2018.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
                aria-label="X / Twitter"
              >
                <SiX className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-widest mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Passenger Transport",
                "Cargo Delivery",
                "Fleet Hire",
                "Express Shipment",
                "Long Haul Freight",
              ].map((s) => (
                <li key={s}>
                  <span className="text-white/55 hover:text-white/90 text-sm transition-colors cursor-pointer">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-widest mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>123 Logistics Ave, Transport Hub, TX 75001</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-white transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="mailto:dispatch@aktransport.com"
                  className="hover:text-white transition-colors"
                >
                  dispatch@aktransport.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {year} AK Transport. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Built with <span className="text-accent">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/70 hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/"
              className="text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
