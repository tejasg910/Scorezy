
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./auth-schema";
import { Checkout } from "@polar-sh/nextjs";
import { polar, checkout, portal, webhooks } from '@polar-sh/better-auth'
import { Polar } from '@polar-sh/sdk'
import { handleSubscriptionActive, handleSubscriptionRevoked } from "./polar-handlers";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
})
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true,        // allow setting during sign-up
      },
       plan: {
        type: 'string',
        defaultValue: 'free',
      },
      planExpiresAt: {
        type: 'date',
        required: false,
      }
    },
  },
   plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            { productId: process.env.POLAR_PRO_PRODUCT_ID!, slug: 'pro' }
          ],
          successUrl: '/teacher/billing?success=true',
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionCreated: async (payload) => {
            await handleSubscriptionActive(payload.data)
          },
          onSubscriptionUpdated: async (payload) => {
            await handleSubscriptionActive(payload.data)
          },
          onSubscriptionRevoked: async (payload) => {
            await handleSubscriptionRevoked(payload.data.customer.externalId!)
          },
        }),
      ]
    })
  ]
});
export type Auth = typeof auth