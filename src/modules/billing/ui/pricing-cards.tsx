"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { startCheckout } from "../server/actions/billing.actions";
import { useTransition } from "react";

export function PricingCards() {
  return (
    <section id="pricing" className="py-24 px-6 max-w-[1200px] mx-auto pt-0">
      <ScrollReveal className="text-center mb-16">
        <div className="text-[#b18aff] text-xs font-semibold tracking-[0.16em] uppercase mb-4">Pricing</div>
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Free to start,<br />powerful to scale</h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <PricingCard 
           name="Free"
           amount={0}
           period="Forever free"
           feats={["1 class", "Up to 30 students", "10 quizzes/month", "Basic analytics"]}
           dimmedFeats={["Export reports", "Priority support"]}
           btnText="Get Started"
        />
        <PricingCard 
           name="Pro"
           amount={499}
           period="per month"
           featured
           feats={["Unlimited classes", "Unlimited students", "Unlimited quizzes", "Advanced analytics", "Export reports"]}
           dimmedFeats={["Priority support"]}
           btnText="Start Pro Trial"
           onAction={async () => {
             await startCheckout();
           }}
        />
        <PricingCard 
           name="School"
           amount="Custom"
           period="per institution"
           feats={["All Pro features", "Multiple teacher accounts", "Institutional branding", "API Access", "SSO Integration", "24/7 Priority support"]}
           btnText="Contact Sales"
        />
      </div>
    </section>
  );
}

function PricingCard({ name, amount, period, feats, dimmedFeats = [], featured = false, btnText, onAction }: any) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    if (onAction) {
      startTransition(async () => {
        await onAction();
      });
    }
  };

  return (
    <div className={`p-10 bg-[#0a0a0f] hover:bg-[#15151e] transition-colors relative h-full flex flex-col ${featured ? 'bg-[#15151e] shadow-2xl z-10' : ''}`}>
      {featured && <div className="absolute top-0 right-0 bg-[#8b5cf6] text-[0.65rem] font-bold tracking-widest text-white px-4 py-1.5">POPULAR</div>}
      <div className="text-[0.72rem] uppercase tracking-widest text-[#71717a] mb-6">{name}</div>
      <div className="font-heading text-5xl font-extrabold tracking-tighter mb-2">
        {typeof amount === 'number' ? <><span className="text-xl align-super font-normal mr-1 text-[#b18aff]">₹</span>{amount}</> : amount}
      </div>
      <div className="text-sm text-[#71717a] mb-10">{period}</div>
      <ul className="space-y-4 mb-10 flex-1">
        {feats.map((f: string) => <li key={f} className="text-[0.9rem] text-[#a1a1aa] flex gap-3"><span className="text-[#b18aff] font-bold">✓</span> {f}</li>)}
        {dimmedFeats?.map((f: string) => <li key={f} className="text-[0.9rem] text-[#404040] flex gap-3"><span className="shrink-0">×</span> {f}</li>)}
      </ul>
      <button 
        onClick={handleAction}
        disabled={isPending}
        className={`w-full py-4 text-[0.85rem] font-bold tracking-wider font-heading transition-all ${
          featured 
            ? 'bg-[#8b5cf6] hover:bg-[#a78bfa] text-white' 
            : 'border border-white/10 text-[#71717a] hover:border-[#b18aff] hover:text-[#f0eeff]'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPending ? "Redirecting..." : btnText}
      </button>
    </div>
  );
}
