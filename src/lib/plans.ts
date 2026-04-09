export const PLANS = {
  free: {
    label: 'Free',
    maxClassrooms: 1,
    maxStudentsPerClass: 30,
    maxQuizzesPerMonth: 10,
    canExportReports: false,
    canAccessAnalytics: false,
  },
  pro: {
    label: 'Pro',
    maxClassrooms: Infinity,
    maxStudentsPerClass: Infinity,
    maxQuizzesPerMonth: Infinity,
    canExportReports: true,
    canAccessAnalytics: true,
  },
} as const

export type Plan = keyof typeof PLANS

// Map Stripe Price IDs to your plan names
// You get these from your Stripe dashboard
export const STRIPE_PRICE_TO_PLAN: Record<string, Plan> = {
  'price_xxx_pro_monthly': 'pro',
  'price_xxx_pro_yearly': 'pro',
}

export const PLAN_TO_STRIPE_PRICE: Record<string, string> = {
  pro_monthly: 'price_xxx_pro_monthly',
  pro_yearly:  'price_xxx_pro_yearly',
}