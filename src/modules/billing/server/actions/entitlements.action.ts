// lib/entitlements.ts
"use server"
import { cache } from 'react'
import { db } from '@/db'
import { user, classrooms, quizzes } from '@/db/schema'
import { eq, count, gte, and } from 'drizzle-orm'
import { PLANS, type Plan } from '../../../../lib/plans'
import { getSession } from '@/app/auth/lib/session'

export const getEntitlements = cache(async function getEntitlements() {
  const session = await getSession();
  if (!session) return null;

  const teacher = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: { plan: true, planExpiresAt: true }
  })

  // If plan has expired, fall back to free
  const isExpired = teacher?.planExpiresAt 
    ? teacher.planExpiresAt < new Date() 
    : false

  const planKey = (!teacher || isExpired ? 'free' : teacher.plan) as Plan
  const plan = PLANS[planKey] ?? PLANS.free

  // Count current usage
  const [{ classroomCount }] = await db
    .select({ classroomCount: count() })
    .from(classrooms)
    .where(eq(classrooms.teacherId, session.user.id))

  const monthStart = new Date()
  monthStart.setDate(1); monthStart.setHours(0,0,0,0)

  const [{ quizCount }] = await db
    .select({ quizCount: count() })
    .from(quizzes)
    .innerJoin(classrooms, eq(quizzes.classroomId, classrooms.id))
    .where(and(
      eq(classrooms.teacherId, session.user.id),
      gte(quizzes.createdAt, monthStart)
    ))

  return {
    plan: planKey,
    maxStudentsPerClass: plan.maxStudentsPerClass,
    canCreateClassroom: classroomCount < plan.maxClassrooms,
    canCreateQuiz: quizCount < plan.maxQuizzesPerMonth,
    canExportReports: plan.canExportReports,
    canAccessAnalytics: plan.canAccessAnalytics,
    usage: {
      classrooms: { 
        used: classroomCount, 
        max: plan.maxClassrooms  // Infinity for pro
      },
      quizzes: { 
        used: quizCount, 
        max: plan.maxQuizzesPerMonth 
      },
    }
  }
})

export type Entitlements = Awaited<ReturnType<typeof getEntitlements>>