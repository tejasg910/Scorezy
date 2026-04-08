ALTER TABLE "questions" ADD COLUMN "marks" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "time_limit" integer DEFAULT 30;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "passing_marks" integer DEFAULT 0;