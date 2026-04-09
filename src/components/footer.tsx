import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 md:px-12 py-12 text-center md:text-left bg-[#0a0a0f]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-heading text-xl font-extrabold tracking-tighter text-[#f0eeff]">
          score<span className="text-[#b18aff]">zy</span>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="text-[0.8rem] text-[#71717a] hover:text-[#f0eeff] transition-colors">Privacy</Link>
          <Link href="#" className="text-[0.8rem] text-[#71717a] hover:text-[#f0eeff] transition-colors">Terms</Link>
          <Link href="#" className="text-[0.8rem] text-[#71717a] hover:text-[#f0eeff] transition-colors">Contact</Link>
        </div>
        <div className="text-[0.8rem] text-[#404040]">© 2026 Scorezz. Digital Excellence.</div>
      </div>
    </footer>
  );
}
