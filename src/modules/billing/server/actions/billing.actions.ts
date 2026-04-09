// modules/billing/actions.ts
'use server'

import { polar } from '@/lib/polar'
import { getSession } from '@/app/auth/lib/session'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'

// ── Checkout ──
export async function startCheckout() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  if (session.user.role !== 'teacher') throw new Error('Teachers only')

  const checkout = await polar.checkouts.create({
    products: [process.env.POLAR_PRO_PRODUCT_ID!],
    customerEmail: session.user.email,
    customerName: session.user.name,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/billing?success=true`,
  })

  redirect(checkout.url)
}

// ── Cancel at period end (friendly cancel) ──
export async function cancelSubscription() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const subscription = await getActiveSubscription(session.user.email)
  if (!subscription) return { error: 'No active subscription found' }

  // update() with cancelAtPeriodEnd = true → keeps access until billing period ends
  await polar.subscriptions.update({
    id: subscription.id,
    subscriptionUpdate: {
      cancelAtPeriodEnd: true,
    }
  });

  await db.update(user)
    .set({ planCancelAtPeriodEnd: true })
    .where(eq(user.id, session.user.id))

  return { success: true }
}

// ── Revoke immediately (if you ever need it) ──
export async function revokeSubscription() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const subscription = await getActiveSubscription(session.user.email)
  if (!subscription) return { error: 'No active subscription found' }

  // revoke() = cancel immediately, access lost now
  await polar.subscriptions.revoke({ id: subscription.id })

  return { success: true }
}

// ── Resubscribe ──
export async function resubscribe() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const checkout = await polar.checkouts.create({
    products: [process.env.POLAR_PRO_PRODUCT_ID!],
    customerEmail: session.user.email,
    customerName: session.user.name,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/billing?success=true`,
  })

  redirect(checkout.url)
}

// ── Customer Portal ──
export async function openCustomerPortal() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  // We check if the user has a Polar Customer ID
  // Note: the session.user might not have it yet if it was just added to schema
  // So we fetch it from DB or Polar
  const customers = await polar.customers.list({ email: session.user.email })
  const customer = customers.result.items?.[0]

  if (!customer) {
    throw new Error('No customer found')
  }

  const portal = await polar.customerSessions.create({
    customerId: customer.id,
  })

  redirect(portal.customerPortalUrl)
}

// ── Helper ──
async function getActiveSubscription(email: string) {
  const customers = await polar.customers.list({ email })
  const customer = customers.result.items?.[0]
  if (!customer) return null

  const subscriptions = await polar.subscriptions.list({
    customerId: customer.id,
  })

  // Find one that is active and not already set to cancel
  return subscriptions.result.items?.find(
    s => s.status === 'active' && !s.cancelAtPeriodEnd
  ) ?? null
}