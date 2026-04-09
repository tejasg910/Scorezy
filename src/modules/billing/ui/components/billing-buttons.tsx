// app/teacher/billing/components.tsx
'use client'

import { cancelSubscription, openCustomerPortal, resubscribe, revokeSubscription, startCheckout } from "../../server/actions/billing.actions"
import { useState, useTransition, useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
export function CancelButton() {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleCancel() {
    startTransition(async () => {
      await revokeSubscription()
      setConfirming(false)
    })
  }

  if (confirming) {
    return (
      <div className="border border-red-500/10 bg-red-500/5 p-6 space-y-4">
        <p className="text-sm text-[#a1a1aa] leading-relaxed">
          Are you sure? You'll keep Pro access until the end of your billing period.
        </p>
        <div className="flex gap-4">
          <Button 
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 font-bold tracking-wider rounded-none"
          >
            {isPending ? 'Canceling...' : 'Yes, cancel'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="flex-1 font-bold tracking-wider rounded-none border-white/10"
          >
            Keep Pro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="link"
      onClick={() => setConfirming(true)}
      className="text-xs text-[#71717a] hover:text-[#f0eeff] underline underline-offset-4 transition-colors p-0 h-auto"
    >
      Cancel subscription
    </Button>
  )
}

export function ResubscribeButton({ label }: { label: string }) {
  const [state, action, isPending] = useActionState(resubscribe, null)

  return (
    <form action={action}>
      <Button 
        type="submit"
        variant="luxury"
        disabled={isPending}
        className="px-6 py-7 w-full text-base"
      >
        {isPending ? "Resubscribing..." : label}
      </Button>
    </form>
  )
}

export function StartCheckoutButton() {
  const [state, action, isPending] = useActionState(startCheckout, null)

  return (
    <form action={action}>
      <Button 
        type="submit"
        variant="luxury"
        disabled={isPending}
        className="px-6 py-7 w-full text-base"
      >
        {isPending ? "Redirecting..." : "Start Pro"}
      </Button>
    </form>
  )
}

export function ManageBillingButton() {
  const [state, action, isPending] = useActionState(openCustomerPortal, null)

  return (
    <form action={action} className="w-full">
      <Button 
        type="submit"
        variant="outline"
        disabled={isPending}
        className="border-white/10 text-[#f0eeff] hover:bg-white/5 px-6 py-7 font-heading font-bold tracking-widest w-full transition-all rounded-none active:scale-[0.98] text-base"
      >
        {isPending ? "Opening Portal..." : "Manage Billing"}
      </Button>
    </form>
  )
}
