"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [activeTab, setActiveTab] = useState("teacher");

  return (
    <main className="bg-[#0a0a0f] text-[#f0eeff] overflow-x-hidden pt-24">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.06]" 
            style={{ 
              backgroundImage: `linear-gradient(#b18aff 1px, transparent 1px), linear-gradient(90deg, #b18aff 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)'
            }}
          />
          <motion.div 
            animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] rounded-full bg-[#b18aff]/15 blur-[100px]" 
          />
          <motion.div 
            animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-[50px] -left-[80px] w-[400px] h-[400px] rounded-full bg-[#c084fc]/10 blur-[100px]" 
          />
        </div>

        <div className="relative z-10 max-w-[900px] text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border border-[#b18aff]/40 bg-[#b18aff]/10 px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.12em] uppercase text-[#b18aff] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b18aff] animate-pulse" />
            Mock Tests · Practice · Progress
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-5xl md:text-8xl lg:text-[6.5rem] font-extrabold leading-[0.95] tracking-tighter mb-8"
          >
            Ace Every Exam<br />
            with <span className="text-[#b18aff] relative inline-block">
              Scorezy
              <span className="absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]" />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#a8a29e] max-w-[560px] mx-auto leading-relaxed mb-12"
          >
            A powerful quiz platform for teachers and students. Create classes, build quizzes, share invite codes — and track every attempt in real-time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/sign-up">
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-56 h-14 bg-[#8b5cf6] hover:bg-[#a78bfa] text-white text-base font-bold tracking-wider transition-all"
                style={{ clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)" }}
              >
                Start for Free →
              </motion.button>
            </Link>
            <button className="flex items-center gap-2 px-8 py-3.5 border border-white/10 text-[#a8a29e] hover:text-white hover:border-[#b18aff]/40 transition-all font-heading font-semibold text-base">
              ▶ Watch Demo
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-8 md:gap-12 justify-center items-center mt-16"
          >
            {[
              { label: "Students", value: "10k+" },
              { label: "Teachers", value: "500+" },
              { label: "Attempts", value: "2M+" },
              { label: "Satisfaction", value: "98%" }
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8 md:gap-12">
                <div className="text-center">
                  <div className="font-heading text-2xl md:text-3xl font-extrabold tracking-tighter">
                    {stat.value.replace('+', '')}<span className="text-[#b18aff]">{stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}</span>
                  </div>
                  <div className="text-[0.7rem] text-[#71717a] font-medium tracking-widest uppercase mt-1">{stat.label}</div>
                </div>
                {i < 3 && <div className="hidden sm:block h-10 w-px bg-white/10" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <ScrollReveal>
            <div className="text-[#b18aff] text-xs font-semibold tracking-[0.16em] uppercase mb-4">How it works</div>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Simple flow,<br />powerful results</h2>
            <p className="text-[#a1a1aa] max-w-[520px] mx-auto leading-relaxed">Two roles, one platform. Teachers set the stage, students take the spotlight.</p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="flex border border-white/10 w-fit mx-auto mb-14 overflow-hidden rounded-sm">
            {["teacher", "student"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 font-heading text-[0.85rem] font-bold tracking-wider uppercase transition-all ${
                  activeTab === tab ? "bg-[#8b5cf6] text-white" : "text-[#71717a] hover:bg-white/5 hover:text-[#f0eeff]"
                }`}
              >
                For {tab}s
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "teacher" ? (
              <motion.div 
                key="teacher"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10"
              >
                {teacherSteps.map((step, i) => (
                  <StepCard key={step.title} step={{...step, num: `0${i+1}`}} delay={i * 0.1} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="student"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10"
              >
                {studentSteps.map((step, i) => (
                  <StepCard key={step.title} step={{...step, num: `0${i+1}`}} delay={i * 0.1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 max-w-[1200px] mx-auto pt-0">
        <ScrollReveal className="text-center mb-14">
          <div className="text-[#b18aff] text-xs font-semibold tracking-[0.16em] uppercase mb-4">Features</div>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Everything you need<br />to test better</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {/* Main Feature - Unlimited Reattempts */}
          <div className="lg:col-span-2 bg-[#0a0a0f] p-10 md:p-14 hover:bg-[#15151e] transition-colors group">
            <ScrollReveal className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block text-[#b18aff] border border-[#b18aff]/30 px-3 py-1 text-[0.7rem] uppercase tracking-widest mb-6">Core Feature</div>
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">🔄</div>
                <h3 className="font-heading text-2xl font-bold tracking-tight mb-4">Unlimited Reattempts</h3>
                <p className="text-[#a1a1aa] leading-relaxed max-w-[340px]">Students can attempt quizzes as many times as they want. Perfect for exam preparation — every attempt brings better understanding and a higher score.</p>
              </div>
              <div className="bg-[#15151e] border border-white/10 p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <span className="font-heading font-bold text-sm">Physics Mock Test</span>
                  <span className="bg-[#b18aff]/15 text-[#b18aff] text-[0.7rem] font-bold px-3 py-1 tracking-wider uppercase">Attempt 3</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Mechanics", pct: "88%" },
                    { label: "Thermodynamics", pct: "72%" },
                    { label: "Optics", pct: "95%" },
                    { label: "Waves", pct: "60%" }
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-24 text-[0.8rem] text-[#71717a]">{row.label}</span>
                      <div className="flex-1 h-1.5 bg-white/5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: row.pct }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]" 
                        />
                      </div>
                      <span className="w-10 text-right font-heading font-bold text-[0.85rem]">{row.pct}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[0.8rem] text-[#71717a]">Overall Score</span>
                  <span className="font-heading text-3xl font-extrabold text-[#b18aff]">79%</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {[
            { tag: "For Teachers", icon: "🏛️", title: "Class Management", desc: "Create multiple classes, manage students, and organize quizzes by subject or topic — all in one place." },
            { tag: "Access", icon: "🔑", title: "Invite Codes", desc: "Share a simple class code — no emails, no signups required from students. Join instantly on any device." },
            { tag: "Analytics", icon: "📈", title: "Progress Tracking", desc: "View detailed reports per student and per question. Spot weak areas and tailor your teaching accordingly." },
            { tag: "Question Types", icon: "❓", title: "Rich Question Builder", desc: "Add MCQs, true/false, and more. Set individual point values and time limits per question or per quiz." }
          ].map((feat, i) => (
            <div key={feat.title} className="bg-[#0a0a0f] p-12 hover:bg-[#15151e] transition-colors group">
              <ScrollReveal delay={i * 0.1}>
                <div className="inline-block text-[#b18aff] border border-[#b18aff]/30 px-3 py-1 text-[0.7rem] uppercase tracking-widest mb-6">{feat.tag}</div>
                <div className="text-3xl mb-6 group-hover:scale-110 transition-transform origin-left">{feat.icon}</div>
                <h3 className="font-heading text-xl font-bold tracking-tight mb-3">{feat.title}</h3>
                <p className="text-[#a1a1aa] text-[0.9rem] leading-relaxed max-w-[320px]">{feat.desc}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES SECTION */}
      <section id="for-you" className="py-24 px-6 max-w-[1200px] mx-auto pt-0">
        <ScrollReveal className="text-center mb-16">
          <div className="text-[#b18aff] text-xs font-semibold tracking-[0.16em] uppercase mb-4">Built for both</div>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Which role fits you?</h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleCard 
            type="teacher"
            title={<>You teach.<br />We handle the rest.</>}
            list={[
              "Create and manage multiple class rooms",
              "Build quizzes with custom questions",
              "Share class codes with students",
              "View per-student and per-question analytics",
              "Download reports for parent meetings"
            ]}
          />
          <RoleCard 
            type="student"
            title={<>Practice until<br />you perfect it.</>}
            list={[
              "Join any class with a code instantly",
              "Browse all assigned quizzes and mock tests",
              "Attempt quizzes multiple times",
              "See instant scores and correct answers",
              "Track your improvement over time"
            ]}
          />
        </div>
      </section>

      {/* PRICING SECTION */}
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

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-12 text-center md:text-left">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-heading text-xl font-extrabold tracking-tighter">
            score<span className="text-[#b18aff]">zy</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-[0.8rem] text-[#71717a] hover:text-[#f0eeff] transition-colors">Privacy</Link>
            <Link href="#" className="text-[0.8rem] text-[#71717a] hover:text-[#f0eeff] transition-colors">Terms</Link>
            <Link href="#" className="text-[0.8rem] text-[#71717a] hover:text-[#f0eeff] transition-colors">Contact</Link>
          </div>
          <div className="text-[0.8rem] text-[#404040]">© 2026 Scorezy. Digital Excellence.</div>
        </div>
      </footer>
    </main>
  );
}

function StepCard({ step, delay }: { step: any; delay: number }) {
  return (
    <div className="bg-[#0a0a0f] p-10 hover:bg-[#15151e] transition-colors group relative">
      <ScrollReveal delay={delay}>
        <div className="font-heading text-5xl font-extrabold text-[#b18aff]/10 group-hover:text-[#b18aff]/20 transition-colors tracking-tighter mb-4">{step.num}</div>
        <div className="w-11 h-11 bg-[#b18aff]/10 border border-[#b18aff]/25 grid place-items-center text-xl mb-6">{step.icon}</div>
        <h3 className="font-heading font-bold mb-3 tracking-tight">{step.title}</h3>
        <p className="text-[#a1a1aa] text-sm leading-relaxed">{step.desc}</p>
        <span className="absolute top-6 right-6 text-[#b18aff]/30 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
      </ScrollReveal>
    </div>
  );
}

function RoleCard({ type, title, list }: { type: string; title: any; list: string[] }) {
  return (
    <ScrollReveal direction={type === "teacher" ? "right" : "left"} className="group h-full">
      <div className={`p-10 border border-white/10 bg-[#15151e] relative overflow-hidden h-full flex flex-col`}>
        <div className={`absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5 ${type === 'teacher' ? 'bg-[#8b5cf6]' : 'bg-[#c084fc]'}`} />
        <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-widest text-[#71717a] mb-6">
           <div className="w-5 h-px bg-current" /> {type}
        </div>
        <h3 className="font-heading text-2xl font-extrabold tracking-tight mb-8 leading-tight">{title}</h3>
        <ul className="space-y-4 mb-10 flex-1">
          {list.map(item => (
            <li key={item} className="flex gap-3 text-[0.9rem] text-[#a1a1aa] leading-snug">
              <span className="text-[#b18aff] shrink-0">→</span> {item}
            </li>
          ))}
        </ul>
        <button className="flex items-center gap-2 font-heading text-[0.85rem] font-bold text-[#b18aff] tracking-wider transition-all hover:gap-4">
           Register as {type === 'teacher' ? 'Teacher' : 'Student'} →
        </button>
      </div>
    </ScrollReveal>
  );
}

function PricingCard({ name, amount, period, feats, dimmedFeats = [], featured = false, btnText }: any) {
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
      <button className={`w-full py-4 text-[0.85rem] font-bold tracking-wider font-heading transition-all ${featured ? 'bg-[#8b5cf6] hover:bg-[#a78bfa] text-white' : 'border border-white/10 text-[#71717a] hover:border-[#b18aff] hover:text-[#f0eeff]'}`}>
        {btnText}
      </button>
    </div>
  );
}

const teacherSteps = [
  { icon: "🏫", title: "Create a Class", desc: "Set up your classroom with a name and subject. Get a unique class code to share with students." },
  { icon: "📝", title: "Build a Quiz", desc: "Add multiple-choice, true/false, or short answer questions. Set time limits and point values." },
  { icon: "🔗", title: "Share the Code", desc: "Share the quiz code with your class. Students join instantly — no emails needed." },
  { icon: "📊", title: "Track Results", desc: "View every student's score, attempts, and question-level analytics from your dashboard." }
];

const studentSteps = [
  { icon: "🎓", title: "Join a Class", desc: "Enter the class code from your teacher to instantly join the classroom and see all quizzes." },
  { icon: "🔍", title: "Browse Quizzes", desc: "View all assigned mock tests and practice quizzes available in your classes." },
  { icon: "⚡", title: "Attempt Anytime", desc: "Start a quiz whenever you're ready. Attempt multiple times to improve your score." },
  { icon: "🏆", title: "View Your Score", desc: "See instant results after each attempt. Track your improvement over multiple tries." }
];
