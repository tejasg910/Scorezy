// modules/billing/actions.ts
'use server'

import { polar } from '@/lib/polar'
import { getSession } from '@/app/auth/lib/session'
import { redirect } from 'next/navigation'

export async function startCheckout() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  if (session.user.role !== 'teacher') throw new Error('Teachers only')
  const checkout = await polar.checkouts.create({
    products: [process.env.POLAR_PRO_PRODUCT_ID!],
    customerEmail: session.user.email,
    customerName: session.user.name,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/dashboard?success=true`,
  })

  redirect(checkout.url)
}