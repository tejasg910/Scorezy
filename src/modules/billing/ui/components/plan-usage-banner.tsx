import { getEntitlements, type Entitlements } from '../../server/actions/entitlements.action'
import { PLANS } from '@/lib/plans'

type Props = {
  /** Pass pre-fetched entitlements to skip the DB call (same-request cache still applies either way). */
  entitlements?: Entitlements
}

function fmt(n: number | typeof Infinity): string {
  return n === Infinity ? '∞' : String(n)
}

/**
 * PlanUsageBanner — Server Component
 *
 * Displays classroom + quiz usage next to create-buttons or in the sidebar.
 * Uses React.cache()-wrapped getEntitlements, so zero extra DB calls
 * if another Server Component on the same page already called it.
 */
export async function PlanUsageBanner({ entitlements: prefetched }: Props = {}) {
  const e = prefetched ?? (await getEntitlements())
  if (!e) return null

  const isPro = e.plan === 'pro'
  const { classrooms, quizzes } = e.usage
  const maxStudents = e.maxStudentsPerClass

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Classrooms pill */}
      <UsagePill
        label="Classrooms"
        used={classrooms.used}
        max={classrooms.max}
        isPro={isPro}
        accent="#8b5cf6"
      />

      {/* Quizzes/month pill */}
      <UsagePill
        label="Quizzes / mo"
        used={quizzes.used}
        max={quizzes.max}
        isPro={isPro}
        accent="#06b6d4"
      />

      {/* Students per class — static from plan */}
      <span
        title="Max students allowed per classroom on your plan"
        className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-[#71717a]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shrink-0" />
        {isPro ? '∞' : fmt(maxStudents)} students / class
      </span>
    </div>
  )
}

/* ---------- internal sub-component ---------- */

type UsagePillProps = {
  label: string
  used: number
  max: number | typeof Infinity
  isPro: boolean
  accent: string
}

function UsagePill({ label, used, max, isPro, accent }: UsagePillProps) {
  const isInfinite = max === Infinity || isPro
  const pct = isInfinite ? 0 : Math.min((used / (max as number)) * 100, 100)
  const isWarning = !isInfinite && pct >= 80
  const isFull = !isInfinite && used >= (max as number)

  const pillColor = isFull
    ? 'border-red-500/40 bg-red-500/10 text-red-400'
    : isWarning
    ? 'border-orange-500/30 bg-orange-500/5 text-orange-400'
    : 'border-white/10 bg-white/5 text-[#71717a]'

  return (
    <span
      title={`${label}: ${used} / ${isInfinite ? '∞' : max} used`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${pillColor}`}
    >
      {/* colored dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: isFull ? '#ef4444' : isWarning ? '#f97316' : accent }}
      />
      {label}:&nbsp;
      <span className={isFull ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-[#f0eeff]'}>
        {used}
      </span>
      &nbsp;/&nbsp;{isInfinite ? '∞' : fmt(max as number)}
    </span>
  )
}
