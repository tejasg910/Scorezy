import { getEntitlements } from '../../server/actions/entitlements.action'
import Link from 'next/link'

/**
 * SidebarUsageWidget — compact Server Component for the sidebar bottom.
 *
 * Shows a minimal "plan chip" + two usage bars (classrooms, quizzes).
 * Tapping the widget links to /teacher/billing.
 */
export async function SidebarUsageWidget() {
  const e = await getEntitlements()
  if (!e) return null

  const isPro = e.plan === 'pro'
  const { classrooms, quizzes } = e.usage

  return (
    <Link
      href="/teacher/billing"
      className="block group"
      title="View billing & plan"
    >
      <div className="mx-2 mb-2 p-3 border border-white/5 bg-[#15151e] hover:border-[#8b5cf6]/30 transition-all duration-300 relative overflow-hidden">
        {/* top accent bar */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Plan badge row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#71717a]">
            Your Plan
          </span>
          <span
            className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest ${
              isPro
                ? 'bg-[#8b5cf6]/15 text-[#b18aff] border border-[#8b5cf6]/30'
                : 'bg-white/5 text-[#52525b] border border-white/10'
            }`}
          >
            {isPro ? 'PRO' : 'FREE'}
          </span>
        </div>

        {/* Usage bars */}
        <div className="space-y-2.5">
          <UsageBar
            label="Classrooms"
            used={classrooms.used}
            max={classrooms.max}
            isPro={isPro}
            color="#8b5cf6"
          />
          <UsageBar
            label="Quizzes / mo"
            used={quizzes.used}
            max={quizzes.max}
            isPro={isPro}
            color="#06b6d4"
          />
        </div>

        {/* Upgrade nudge — only for free users at 80%+ */}
        {!isPro &&
          (classrooms.used / classrooms.max >= 0.8 ||
            quizzes.used / quizzes.max >= 0.8) && (
            <p className="mt-3 text-[9px] text-[#8b5cf6] font-bold uppercase tracking-wide text-center">
              Upgrade to Pro →
            </p>
          )}
      </div>
    </Link>
  )
}

/* ---------- internal sub-component ---------- */

type UsageBarProps = {
  label: string
  used: number
  max: number | typeof Infinity
  isPro: boolean
  color: string
}

function UsageBar({ label, used, max, isPro, color }: UsageBarProps) {
  const isInfinite = max === Infinity || isPro
  const pct = isInfinite ? 0 : Math.min((used / (max as number)) * 100, 100)
  const isFull = !isInfinite && used >= (max as number)
  const isWarning = !isInfinite && pct >= 80

  const barColor = isFull ? '#ef4444' : isWarning ? '#f97316' : color
  const textColor = isFull ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-[#71717a]'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#52525b]">
          {label}
        </span>
        <span className={`text-[9px] font-bold tabular-nums ${textColor}`}>
          {isInfinite ? `${used} / ∞` : `${used} / ${max}`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-white/5 overflow-hidden">
        {isInfinite ? (
          /* Pro — show a "full" decorative bar */
          <div className="h-full w-full opacity-30" style={{ backgroundColor: color }} />
        ) : (
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        )}
      </div>
    </div>
  )
}
