// app/teacher/billing/page.tsx
import { getSession } from '@/app/auth/lib/session'
import { CancelButton, ManageBillingButton, ResubscribeButton, StartCheckoutButton } from './components/billing-buttons'
import { Badge } from '@/components/ui/badge'

export default async function BillingPage() {
  const session = await getSession()
  const plan = session?.user.plan                            // 'free' | 'pro'
  const expiresAt = session?.user.planExpiresAt
  const cancelAtPeriodEnd = session?.user.planCancelAtPeriodEnd

  const isPro = plan === 'pro'

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f0eeff] pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Billing & Subscription</h1>
          <p className="text-[#a1a1aa]">Manage your plan and billing details.</p>
        </div>

        <div className="bg-[#15151e] border border-white/10 p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-50" />
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#71717a] uppercase tracking-widest">Current Plan</span>
              <Badge 
                className={`px-4 py-1 text-xs font-bold uppercase tracking-widest ${
                  isPro ? 'bg-[#8b5cf6] text-white' : 'bg-white/5 text-[#71717a] border-white/10'
                }`}
              >
                {plan}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Status message */}
              {isPro && !cancelAtPeriodEnd && expiresAt && (
                <div className="flex items-center gap-3 p-4 bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-sm">
                  <span className="text-[#b18aff] text-xl">✓</span>
                  <div className="space-y-0.5">
                    <p className="text-[0.9rem] font-medium text-[#f0eeff]">Active Subscription</p>
                    <p className="text-xs text-[#a1a1aa]">
                      Your plan will renew on <span className="text-[#b18aff]">{new Date(expiresAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>
              )}

              {isPro && cancelAtPeriodEnd && expiresAt && (
                <div className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-sm">
                  <span className="text-orange-400 text-xl font-bold">!</span>
                  <div className="space-y-1">
                    <p className="text-[0.9rem] font-medium text-orange-400">Subscription Canceled</p>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Your Pro access remains active until <span className="text-orange-400 font-semibold">{new Date(expiresAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>. After this date, you will be downgraded to the Free plan.
                    </p>
                  </div>
                </div>
              )}

              {!isPro && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                  <p className="text-sm text-[#a1a1aa]">
                    You are currently using the <span className="text-[#f0eeff] font-bold">Free</span> plan. Upgrade to unlock unlimited classes and quizzes.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            {isPro && cancelAtPeriodEnd && <ResubscribeButton label="Reactivate Pro" />}
            {!isPro && <StartCheckoutButton />}
            
            {isPro && !cancelAtPeriodEnd && (
              <div className="flex justify-center flex-col items-center gap-6">
                <ManageBillingButton />
                <CancelButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}