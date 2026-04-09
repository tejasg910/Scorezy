// app/api/portal/route.ts
import { db } from '@/db'
import { user } from '@/db/schema'
import { CustomerPortal } from '@polar-sh/nextjs'
import { eq } from 'drizzle-orm'

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (req) => {
    // grab polarCustomerId from your DB using the session
    const { getSession } = await import('@/app/auth/lib/session')
    const session = await getSession()
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session?.user.id!),
    })
    return userData?.polarCustomerId ?? ''
  },
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/billing`,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
})