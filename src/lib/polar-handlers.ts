// lib/auth.ts (continued) or lib/polar-handlers.ts

import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function handleSubscriptionActive(subscription: any) {
    console.log("came in webhok", subscription)
    const userId = subscription.customer.externalId // Polar stores your userId here
    if (!userId) return

    await db.update(user)
        .set({
            plan: 'pro',
            polarCustomerId: subscription.customerId,
            planExpiresAt: subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd)
                : null,
            planCancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
        })
        .where(eq(user.id, userId))
}

export async function handleSubscriptionRevoked(userId: string) {
    await db.update(user)
        .set({ plan: 'free', planExpiresAt: null, planCancelAtPeriodEnd: false })
        .where(eq(user.id, userId))
}