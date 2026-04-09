import {
  pgTable, text, boolean, integer,
  timestamp, pgEnum
} from 'drizzle-orm/pg-core'


export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  role: text('role').notNull().default('student'), 
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  planCancelAtPeriodEnd: boolean('plan_cancel_at_period_end').notNull().default(false),

  plan: text('plan').notNull().default('free'),         // 'free' | 'pro'
  polarCustomerId: text('polar_customer_id'),            
  planExpiresAt: timestamp('plan_expires_at'),          
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// ─── Your app tables ────────────────────────────────────────────────────────

export const quizStatusEnum = pgEnum('quiz_status', ['draft', 'published', 'closed'])
export const questionTypeEnum = pgEnum('question_type', ['mcq', 'true_false'])

export const classrooms = pgTable('classrooms', {
  id: text('id').primaryKey(),
  teacherId: text('teacher_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  inviteCode: text('invite_code').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classrooms.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
})

export const quizzes = pgTable('quizzes', {
  id: text('id').primaryKey(),
  classroomId: text('classroom_id').notNull().references(() => classrooms.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: quizStatusEnum('status').notNull().default('draft'),
  opensAt: timestamp('opens_at'),
  closesAt: timestamp('closes_at'),
  timeLimit: integer('time_limit').default(30),
  passingMarks: integer('passing_marks').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const questions = pgTable('questions', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  type: questionTypeEnum('type').notNull(),
  marks: integer('marks').notNull().default(1),
  orderIndex: integer('order_index').notNull(),
})

export const options = pgTable('options', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  orderIndex: integer('order_index').notNull(),
})

export const attempts = pgTable('attempts', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  score: integer('score'),
  total: integer('total'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  submittedAt: timestamp('submitted_at'),
})

export const answers = pgTable('answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull().references(() => questions.id),
  optionId: text('option_id').notNull().references(() => options.id),
  isCorrect: boolean('is_correct').notNull(),
})