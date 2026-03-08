import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Shield,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Users,
    title: "Passenger Transport",
    description:
      "Comfortable, punctual rides for individuals and groups. Airport transfers, corporate shuttles, and long-distance travel.",
    color: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Package,
    title: "Cargo Delivery",
    description:
      "Safe and reliable freight delivery for businesses and individuals. Real-time tracking with guaranteed delivery windows.",
    color: "from-orange-500/10 to-orange-600/5",
    iconBg: "bg-accent/10 text-accent",
  },
  {
    icon: Truck,
    title: "Fleet Hire",
    description:
      "Rent our entire fleet for large-scale operations, events, or ongoing contracts. Flexible terms available.",
    color: "from-green-500/10 to-green-600/5",
    iconBg: "bg-green-500/10 text-green-600",
  },
  {
    icon: Zap,
    title: "Express Shipment",
    description:
      "Same-day and next-day delivery for urgent shipments. Priority handling with dedicated dispatch teams.",
    color: "from-purple-500/10 to-purple-600/5",
    iconBg: "bg-purple-500/10 text-purple-600",
  },
];

const stats = [
  { value: "12,000+", label: "Trips Completed", icon: CheckCircle2 },
  { value: "98.7%", label: "On-Time Rate", icon: Clock },
  { value: "4.9 ★", label: "Customer Rating", icon: Star },
];

const features = [
  {
    title: "Licensed & Insured",
    desc: "All drivers are fully licensed, background-checked, and insured for your peace of mind.",
  },
  {
    title: "Real-Time Tracking",
    desc: "Monitor your shipment or ride in real time with our live tracking system.",
  },
  {
    title: "24/7 Dispatch",
    desc: "Our operations team is available around the clock to handle any situation.",
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[520px] sm:h-[580px] overflow-hidden">
        {/* Background image */}
        <img
          src="/assets/generated/ak-transport-hero.dim_1200x500.jpg"
          alt="AK Transport fleet on highway"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 brand-gradient opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/60 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              <Truck className="w-3 h-3" />
              Nationwide Coverage
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-5">
              Reliable Transport
              <br />
              <span className="text-accent">& Logistics</span>
            </h1>
            <p className="text-white/70 text-lg max-w-lg leading-relaxed mb-8">
              From single passengers to full freight loads — AK Transport
              delivers on time, every time. Book your ride or shipment in
              minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-bold shadow-orange border-0 px-7"
              >
                <Link to="/book">
                  Book a Ride
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <Link to="/track">Track Booking</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        />
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                <div className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-accent text-xs font-bold uppercase tracking-widest">
              What We Offer
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-2 tracking-tight">
              Our Services
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Comprehensive transport and logistics solutions tailored to your
              needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full navy-card-shadow hover:shadow-navy-lg transition-all duration-300 group border-border/50 hover:border-accent/20">
                  <CardContent className="p-6">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${service.iconBg}`}
                    >
                      <service.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-foreground text-base mb-2 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 brand-gradient noise-overlay relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.70 0.19 46) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-accent text-xs font-bold uppercase tracking-widest">
              Why AK Transport
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
              Built on Trust & Precision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-xl p-6"
              >
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-14"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-bold shadow-orange border-0 px-8 text-base h-12"
            >
              <Link to="/book">
                Book Your Trip Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
