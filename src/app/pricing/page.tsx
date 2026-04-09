"use client";

import { PricingCards } from "@/modules/billing/ui/pricing-cards";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <main className="bg-[#0a0a0f] text-[#f0eeff] overflow-x-hidden pt-32 min-h-screen flex flex-col">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.06]" 
          style={{ 
            backgroundImage: `linear-gradient(#b18aff 1px, transparent 1px), linear-gradient(90deg, #b18aff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)'
          }}
        />
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] rounded-full bg-[#b18aff]/15 blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1">
        <div className="text-center mb-12 px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
          >
            Transparent <span className="text-[#b18aff]">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#a1a1aa] max-w-[500px] mx-auto text-lg"
          >
            Simple, fair pricing for educators and institutions. Start for free and upgrade when you're ready to scale.
          </motion.p>
        </div>

        <PricingCards />
      </div>

      <Footer />
    </main>
  );
}
