-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."activity_type" AS ENUM('assignment', 'quiz', 'materials');--> statement-breakpoint
CREATE TYPE "public"."attachment_type" AS ENUM('question', 'section-question', 'student-answer', 'class-card', 'post-comment', 'profile', 'post', 'quiz-evidence', 'assignment', 'materials', 'attendance', 'school-badge', 'chatbox', 'chatbox-message', 'content', 'content-question');--> statement-breakpoint
CREATE TYPE "public"."attendance_type" AS ENUM('in', 'out');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('question', 'exercise', 'content');--> statement-breakpoint
CREATE TYPE "public"."course_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('android', 'ios', 'web');--> statement-breakpoint
CREATE TYPE "public"."evidence_capture_type" AS ENUM('front', 'screen');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('chatbox', 'activity', 'activity-bank', 'assignment', 'quiz', 'materials', 'class-card', 'post', 'quiz-evidence', 'attendance', 'school-badge', 'grade');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple-choice', 'true-false', 'identification', 'essay', 'enumeration', 'matching', 'attachments');--> statement-breakpoint
CREATE TYPE "public"."user_role_type" AS ENUM('student', 'teacher', 'admin', 'partner');--> statement-breakpoint
CREATE TABLE "chatbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classCardId" uuid,
	"groupName" text,
	"groupIcon" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"archive" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "class_work_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"weight" numeric NOT NULL,
	"classCardId" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archive" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classCardId" uuid,
	"type" "activity_type" NOT NULL,
	"options" json,
	"title" text NOT NULL,
	"points" integer NOT NULL,
	"published_date" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline" timestamp with time zone DEFAULT now() NOT NULL,
	"topic" text,
	"classWorkCategoryId" uuid,
	"termId" uuid,
	"availableToStudents" json,
	"notAvailableToStudents" json,
	"bank" boolean DEFAULT false NOT NULL,
	"archive" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"createdBy" uuid,
	"meetingLink" text
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" text NOT NULL,
	"file_path" text DEFAULT '' NOT NULL,
	"file_type" text DEFAULT '' NOT NULL,
	"parentType" "attachment_type",
	"is_deleted" boolean DEFAULT false,
	"is_used" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"file_size" numeric DEFAULT '0',
	"file_name" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_with_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activityId" uuid,
	"tagId" uuid,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_card_id" uuid NOT NULL,
	"type" "attendance_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL,
	"departmentId" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sectionId" uuid,
	"schoolId" uuid NOT NULL,
	"adviserId" uuid,
	"assistantAdviserId" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"imageUrl" text
);
--> statement-breakpoint
CREATE TABLE "chatbox_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatBoxId" uuid,
	"senderId" uuid,
	"message" text,
	"emojis" json,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"pinned" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "class_card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sectionId" uuid,
	"classroomId" uuid NOT NULL,
	"period" text NOT NULL,
	"semester" text,
	"subjectId" uuid,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"bgImage" text,
	"color" text DEFAULT '#f48618ff' NOT NULL,
	"archive" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"meeting_link" text,
	"request_posting" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "term" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"class_card_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"archive" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"school_code" varchar(50) NOT NULL,
	"username" varchar(100),
	"password" varchar(100),
	"site" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"secret" varchar(100),
	"api_key" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "request_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requestToken" text NOT NULL,
	"expiredDate" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grading" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classCardId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"gradeJson" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"postId" uuid NOT NULL,
	"message" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdBy" uuid
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sectionQuestionsId" uuid,
	"activitiesId" uuid,
	"description" text,
	"points" integer DEFAULT 0,
	"type" "question_type",
	"checkForPunctuationsAndSpecialChar" boolean DEFAULT false,
	"checkForCaseSensitiveAnswers" boolean DEFAULT false,
	"shuffleChoicesDuringTest" boolean DEFAULT false,
	"choices" json,
	"answer" json,
	"order" integer DEFAULT 0,
	"bank" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quiz_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_activity_id" uuid NOT NULL,
	"description" text,
	"evidence_capture_type" "evidence_capture_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_mariad_db" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"database" varchar NOT NULL,
	"host" text NOT NULL,
	"port" integer,
	"schoolId" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionId" uuid NOT NULL,
	"studentActivityId" uuid NOT NULL,
	"answers" json,
	"points" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sectionQuestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0,
	"shuffleQuestions" boolean DEFAULT false,
	"bank" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"activitiesId" uuid
);
--> statement-breakpoint
CREATE TABLE "activity_badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"school_badge_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_device" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"device_type" "device_type" NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"device_info" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "notification_device_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "school_badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"enable" boolean DEFAULT true NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"class_card_id" uuid,
	"shared" boolean DEFAULT false NOT NULL,
	"limit" integer DEFAULT 9999,
	"default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid,
	"user_id" uuid NOT NULL,
	"school_badge_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"class_card_id" uuid
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"image" text,
	"link" text,
	"is_read" boolean DEFAULT false,
	"type" "notification_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chatbox_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatboxId" uuid,
	"userId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSeen" timestamp with time zone DEFAULT now(),
	"lastMessageId" uuid
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classCardId" uuid NOT NULL,
	"message" text,
	"pinned" boolean DEFAULT false,
	"isScheduledPost" boolean DEFAULT false,
	"schedulePost" timestamp with time zone,
	"userPostType" "user_role_type",
	"archive" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"createdBy" uuid,
	"isRequestPosting" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"classCardId" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"enabled" boolean DEFAULT true NOT NULL,
	"has_permit" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activityId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"score" integer DEFAULT 0,
	"submitted" boolean DEFAULT false,
	"countSubmitted" integer DEFAULT 1,
	"submitDate" timestamp DEFAULT now(),
	"graded" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"gradedBy" uuid,
	"available" boolean DEFAULT true,
	"gradedDate" timestamp DEFAULT now(),
	"startedDate" timestamp DEFAULT now(),
	"feedback" json DEFAULT 'null'::json,
	"teacherFeedback" json DEFAULT 'null'::json
);
--> statement-breakpoint
CREATE TABLE "data_migration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"data_id" text,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feat_type" text NOT NULL,
	"user_prompt" text NOT NULL,
	"prompt_title" text,
	"result" text,
	"ai_model_name" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"completedAt" timestamp with time zone,
	"token_ai_value" integer,
	"credits_spent" integer,
	"status" text NOT NULL,
	"createdBy" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chatbox" ADD CONSTRAINT "chatbox_classCardId_class_card_id_fk" FOREIGN KEY ("classCardId") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_work_category" ADD CONSTRAINT "class_work_category_classCardId_class_card_id_fk" FOREIGN KEY ("classCardId") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_classCardId_class_card_id_fk" FOREIGN KEY ("classCardId") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_classWorkCategoryId_class_work_category_id_fk" FOREIGN KEY ("classWorkCategoryId") REFERENCES "public"."class_work_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_termId_term_id_fk" FOREIGN KEY ("termId") REFERENCES "public"."term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_with_tags" ADD CONSTRAINT "activity_with_tags_activityId_activities_id_fk" FOREIGN KEY ("activityId") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_with_tags" ADD CONSTRAINT "activity_with_tags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_card_id_class_card_id_fk" FOREIGN KEY ("class_card_id") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_sectionId_sections_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_adviserId_users_id_fk" FOREIGN KEY ("adviserId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_assistantAdviserId_users_id_fk" FOREIGN KEY ("assistantAdviserId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_messages" ADD CONSTRAINT "chatbox_messages_chatBoxId_chatbox_id_fk" FOREIGN KEY ("chatBoxId") REFERENCES "public"."chatbox"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_messages" ADD CONSTRAINT "chatbox_messages_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_card" ADD CONSTRAINT "class_card_sectionId_sections_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_card" ADD CONSTRAINT "class_card_classroomId_classrooms_id_fk" FOREIGN KEY ("classroomId") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_card" ADD CONSTRAINT "class_card_subjectId_subjects_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term" ADD CONSTRAINT "term_class_card_id_class_card_id_fk" FOREIGN KEY ("class_card_id") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term" ADD CONSTRAINT "term_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grading" ADD CONSTRAINT "grading_classCardId_class_card_id_fk" FOREIGN KEY ("classCardId") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grading" ADD CONSTRAINT "grading_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_sectionQuestionsId_sectionQuestions_id_fk" FOREIGN KEY ("sectionQuestionsId") REFERENCES "public"."sectionQuestions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_activitiesId_activities_id_fk" FOREIGN KEY ("activitiesId") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_evidence" ADD CONSTRAINT "quiz_evidence_student_activity_id_student_activity_id_fk" FOREIGN KEY ("student_activity_id") REFERENCES "public"."student_activity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_mariad_db" ADD CONSTRAINT "school_mariad_db_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_studentActivityId_student_activity_id_fk" FOREIGN KEY ("studentActivityId") REFERENCES "public"."student_activity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sectionQuestions" ADD CONSTRAINT "sectionQuestions_activitiesId_activities_id_fk" FOREIGN KEY ("activitiesId") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_badge" ADD CONSTRAINT "activity_badge_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_badge" ADD CONSTRAINT "activity_badge_school_badge_id_school_badge_id_fk" FOREIGN KEY ("school_badge_id") REFERENCES "public"."school_badge"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_badge" ADD CONSTRAINT "activity_badge_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_device" ADD CONSTRAINT "notification_device_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_badge" ADD CONSTRAINT "school_badge_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_badge" ADD CONSTRAINT "school_badge_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_badge" ADD CONSTRAINT "school_badge_class_card_id_class_card_id_fk" FOREIGN KEY ("class_card_id") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_badge" ADD CONSTRAINT "student_badge_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_badge" ADD CONSTRAINT "student_badge_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_badge" ADD CONSTRAINT "student_badge_school_badge_id_school_badge_id_fk" FOREIGN KEY ("school_badge_id") REFERENCES "public"."school_badge"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_badge" ADD CONSTRAINT "student_badge_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_badge" ADD CONSTRAINT "student_badge_class_card_id_class_card_id_fk" FOREIGN KEY ("class_card_id") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_members" ADD CONSTRAINT "chatbox_members_chatboxId_chatbox_id_fk" FOREIGN KEY ("chatboxId") REFERENCES "public"."chatbox"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_members" ADD CONSTRAINT "chatbox_members_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_members" ADD CONSTRAINT "chatbox_members_lastMessageId_chatbox_messages_id_fk" FOREIGN KEY ("lastMessageId") REFERENCES "public"."chatbox_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_classCardId_class_card_id_fk" FOREIGN KEY ("classCardId") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_classCardId_class_card_id_fk" FOREIGN KEY ("classCardId") REFERENCES "public"."class_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_activity" ADD CONSTRAINT "student_activity_activityId_activities_id_fk" FOREIGN KEY ("activityId") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_activity" ADD CONSTRAINT "student_activity_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_activity" ADD CONSTRAINT "student_activity_gradedBy_users_id_fk" FOREIGN KEY ("gradedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chatbox_archive_idx" ON "chatbox" USING btree ("archive" bool_ops);--> statement-breakpoint
CREATE INDEX "chatbox_class_card_id_idx" ON "chatbox" USING btree ("classCardId" uuid_ops);--> statement-breakpoint
CREATE INDEX "chatbox_created_at_idx" ON "chatbox" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "class_work_category_archive_idx" ON "class_work_category" USING btree ("archive" bool_ops);--> statement-breakpoint
CREATE INDEX "class_work_category_class_card_id_idx" ON "class_work_category" USING btree ("classCardId" uuid_ops);--> statement-breakpoint
CREATE INDEX "class_work_category_created_at_idx" ON "class_work_category" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activities_archive_idx" ON "activities" USING btree ("archive" bool_ops);--> statement-breakpoint
CREATE INDEX "activities_bank_idx" ON "activities" USING btree ("bank" bool_ops);--> statement-breakpoint
CREATE INDEX "activities_class_card_id_idx" ON "activities" USING btree ("classCardId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activities_class_work_category_id_idx" ON "activities" USING btree ("classWorkCategoryId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activities_created_at_idx" ON "activities" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activities_created_by_idx" ON "activities" USING btree ("createdBy" uuid_ops);--> statement-breakpoint
CREATE INDEX "activities_deadline_idx" ON "activities" USING btree ("deadline" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activities_published_date_idx" ON "activities" USING btree ("published_date" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activities_term_id_idx" ON "activities" USING btree ("termId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activities_title_idx" ON "activities" USING btree ("title" text_ops);--> statement-breakpoint
CREATE INDEX "activities_type_idx" ON "activities" USING btree ("type" enum_ops);--> statement-breakpoint
CREATE INDEX "attachments_created_at_idx" ON "attachments" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "attachments_created_by_idx" ON "attachments" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "attachments_is_deleted_idx" ON "attachments" USING btree ("is_deleted" bool_ops);--> statement-breakpoint
CREATE INDEX "attachments_is_used_idx" ON "attachments" USING btree ("is_used" bool_ops);--> statement-breakpoint
CREATE INDEX "attachments_parent_id_idx" ON "attachments" USING btree ("parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "attachments_parent_type_idx" ON "attachments" USING btree ("parentType" enum_ops);--> statement-breakpoint
CREATE INDEX "activity_with_tags_activity_id_idx" ON "activity_with_tags" USING btree ("activityId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activity_with_tags_created_at_idx" ON "activity_with_tags" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activity_with_tags_tag_id_idx" ON "activity_with_tags" USING btree ("tagId" uuid_ops);--> statement-breakpoint
CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "attendance_class_card_id_idx" ON "attendance" USING btree ("class_card_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "attendance_created_at_idx" ON "attendance" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "attendance_type_idx" ON "attendance" USING btree ("type" enum_ops);--> statement-breakpoint
CREATE INDEX "attendance_user_id_idx" ON "attendance" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "sections_created_at_idx" ON "sections" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "sections_department_id_idx" ON "sections" USING btree ("departmentId" uuid_ops);--> statement-breakpoint
CREATE INDEX "sections_level_idx" ON "sections" USING btree ("level" text_ops);--> statement-breakpoint
CREATE INDEX "sections_name_idx" ON "sections" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "classrooms_adviser_id_idx" ON "classrooms" USING btree ("adviserId" uuid_ops);--> statement-breakpoint
CREATE INDEX "classrooms_assistant_adviser_id_idx" ON "classrooms" USING btree ("assistantAdviserId" uuid_ops);--> statement-breakpoint
CREATE INDEX "classrooms_created_at_idx" ON "classrooms" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "classrooms_school_id_idx" ON "classrooms" USING btree ("schoolId" uuid_ops);--> statement-breakpoint
CREATE INDEX "classrooms_section_id_idx" ON "classrooms" USING btree ("sectionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "subjects_code_idx" ON "subjects" USING btree ("code" text_ops);--> statement-breakpoint
CREATE INDEX "subjects_created_at_idx" ON "subjects" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "subjects_name_idx" ON "subjects" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role" enum_ops);--> statement-breakpoint
CREATE INDEX "chatbox_messages_chat_box_id_idx" ON "chatbox_messages" USING btree ("chatBoxId" uuid_ops);--> statement-breakpoint
CREATE INDEX "chatbox_messages_created_at_idx" ON "chatbox_messages" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "chatbox_messages_pinned_idx" ON "chatbox_messages" USING btree ("pinned" bool_ops);--> statement-breakpoint
CREATE INDEX "chatbox_messages_sender_id_idx" ON "chatbox_messages" USING btree ("senderId" uuid_ops);--> statement-breakpoint
CREATE INDEX "class_card_archive_idx" ON "class_card" USING btree ("archive" bool_ops);--> statement-breakpoint
CREATE INDEX "class_card_classroom_id_idx" ON "class_card" USING btree ("classroomId" uuid_ops);--> statement-breakpoint
CREATE INDEX "class_card_created_at_idx" ON "class_card" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "class_card_request_posting_idx" ON "class_card" USING btree ("request_posting" bool_ops);--> statement-breakpoint
CREATE INDEX "class_card_section_id_idx" ON "class_card" USING btree ("sectionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "class_card_subject_id_idx" ON "class_card" USING btree ("subjectId" uuid_ops);--> statement-breakpoint
CREATE INDEX "term_archive_idx" ON "term" USING btree ("archive" bool_ops);--> statement-breakpoint
CREATE INDEX "term_class_card_id_idx" ON "term" USING btree ("class_card_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "term_created_at_idx" ON "term" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "term_created_by_idx" ON "term" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "schools_created_at_idx" ON "schools" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "schools_school_code_idx" ON "schools" USING btree ("school_code" text_ops);--> statement-breakpoint
CREATE INDEX "schools_username_idx" ON "schools" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "request_cache_expired_date_idx" ON "request_cache" USING btree ("expiredDate" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "request_cache_request_token_idx" ON "request_cache" USING btree ("requestToken" text_ops);--> statement-breakpoint
CREATE INDEX "grading_class_card_id_idx" ON "grading" USING btree ("classCardId" uuid_ops);--> statement-breakpoint
CREATE INDEX "grading_created_at_idx" ON "grading" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "grading_user_id_idx" ON "grading" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "post_comment_created_at_idx" ON "post_comment" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "post_comment_created_by_idx" ON "post_comment" USING btree ("createdBy" uuid_ops);--> statement-breakpoint
CREATE INDEX "post_comment_post_id_idx" ON "post_comment" USING btree ("postId" uuid_ops);--> statement-breakpoint
CREATE INDEX "questions_activities_id_idx" ON "questions" USING btree ("activitiesId" uuid_ops);--> statement-breakpoint
CREATE INDEX "questions_bank_idx" ON "questions" USING btree ("bank" bool_ops);--> statement-breakpoint
CREATE INDEX "questions_created_at_idx" ON "questions" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "questions_order_idx" ON "questions" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "questions_section_questions_id_idx" ON "questions" USING btree ("sectionQuestionsId" uuid_ops);--> statement-breakpoint
CREATE INDEX "questions_type_idx" ON "questions" USING btree ("type" enum_ops);--> statement-breakpoint
CREATE INDEX "quiz_evidence_created_at_idx" ON "quiz_evidence" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "quiz_evidence_evidence_capture_type_idx" ON "quiz_evidence" USING btree ("evidence_capture_type" enum_ops);--> statement-breakpoint
CREATE INDEX "quiz_evidence_student_activity_id_idx" ON "quiz_evidence" USING btree ("student_activity_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "school_mariad_db_created_at_idx" ON "school_mariad_db" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "school_mariad_db_school_id_idx" ON "school_mariad_db" USING btree ("schoolId" uuid_ops);--> statement-breakpoint
CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "departments_name_idx" ON "departments" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "student_answers_created_at_idx" ON "student_answers" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "student_answers_question_id_idx" ON "student_answers" USING btree ("questionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_answers_student_activity_id_idx" ON "student_answers" USING btree ("studentActivityId" uuid_ops);--> statement-breakpoint
CREATE INDEX "section_questions_activities_id_idx" ON "sectionQuestions" USING btree ("activitiesId" uuid_ops);--> statement-breakpoint
CREATE INDEX "section_questions_bank_idx" ON "sectionQuestions" USING btree ("bank" bool_ops);--> statement-breakpoint
CREATE INDEX "section_questions_created_at_idx" ON "sectionQuestions" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "section_questions_order_idx" ON "sectionQuestions" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX "activity_badge_activity_id_idx" ON "activity_badge" USING btree ("activity_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "activity_badge_created_at_idx" ON "activity_badge" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activity_badge_created_by_idx" ON "activity_badge" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "activity_badge_school_badge_id_idx" ON "activity_badge" USING btree ("school_badge_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "notification_device_created_at_idx" ON "notification_device" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "notification_device_device_type_idx" ON "notification_device" USING btree ("device_type" enum_ops);--> statement-breakpoint
CREATE INDEX "notification_device_user_id_idx" ON "notification_device" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "school_badge_class_card_id_idx" ON "school_badge" USING btree ("class_card_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "school_badge_created_at_idx" ON "school_badge" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "school_badge_created_by_idx" ON "school_badge" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "school_badge_default_idx" ON "school_badge" USING btree ("default" bool_ops);--> statement-breakpoint
CREATE INDEX "school_badge_enable_idx" ON "school_badge" USING btree ("enable" bool_ops);--> statement-breakpoint
CREATE INDEX "school_badge_school_id_idx" ON "school_badge" USING btree ("school_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "school_badge_shared_idx" ON "school_badge" USING btree ("shared" bool_ops);--> statement-breakpoint
CREATE INDEX "student_badge_activity_id_idx" ON "student_badge" USING btree ("activity_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_badge_class_card_id_idx" ON "student_badge" USING btree ("class_card_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_badge_created_at_idx" ON "student_badge" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "student_badge_created_by_idx" ON "student_badge" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_badge_school_badge_id_idx" ON "student_badge" USING btree ("school_badge_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_badge_user_id_idx" ON "student_badge" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "notification_is_read_idx" ON "notification" USING btree ("is_read" bool_ops);--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notification" USING btree ("type" enum_ops);--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "chatbox_members_chatbox_id_idx" ON "chatbox_members" USING btree ("chatboxId" uuid_ops);--> statement-breakpoint
CREATE INDEX "chatbox_members_created_at_idx" ON "chatbox_members" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "chatbox_members_last_message_id_idx" ON "chatbox_members" USING btree ("lastMessageId" uuid_ops);--> statement-breakpoint
CREATE INDEX "chatbox_members_last_seen_idx" ON "chatbox_members" USING btree ("lastSeen" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "chatbox_members_user_id_idx" ON "chatbox_members" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "post_archive_idx" ON "post" USING btree ("archive" bool_ops);--> statement-breakpoint
CREATE INDEX "post_class_card_id_idx" ON "post" USING btree ("classCardId" uuid_ops);--> statement-breakpoint
CREATE INDEX "post_created_at_idx" ON "post" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "post_created_by_idx" ON "post" USING btree ("createdBy" uuid_ops);--> statement-breakpoint
CREATE INDEX "post_is_request_posting_idx" ON "post" USING btree ("isRequestPosting" bool_ops);--> statement-breakpoint
CREATE INDEX "post_is_scheduled_post_idx" ON "post" USING btree ("isScheduledPost" bool_ops);--> statement-breakpoint
CREATE INDEX "post_pinned_idx" ON "post" USING btree ("pinned" bool_ops);--> statement-breakpoint
CREATE INDEX "post_schedule_post_idx" ON "post" USING btree ("schedulePost" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "participants_class_card_id_idx" ON "participants" USING btree ("classCardId" uuid_ops);--> statement-breakpoint
CREATE INDEX "participants_created_at_idx" ON "participants" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "participants_enabled_idx" ON "participants" USING btree ("enabled" bool_ops);--> statement-breakpoint
CREATE INDEX "participants_has_permit_idx" ON "participants" USING btree ("has_permit" bool_ops);--> statement-breakpoint
CREATE INDEX "participants_user_id_idx" ON "participants" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_activity_activity_id_idx" ON "student_activity" USING btree ("activityId" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_activity_available_idx" ON "student_activity" USING btree ("available" bool_ops);--> statement-breakpoint
CREATE INDEX "student_activity_created_at_idx" ON "student_activity" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "student_activity_graded_by_idx" ON "student_activity" USING btree ("gradedBy" uuid_ops);--> statement-breakpoint
CREATE INDEX "student_activity_graded_idx" ON "student_activity" USING btree ("graded" bool_ops);--> statement-breakpoint
CREATE INDEX "student_activity_submit_date_idx" ON "student_activity" USING btree ("submitDate" timestamp_ops);--> statement-breakpoint
CREATE INDEX "student_activity_submitted_idx" ON "student_activity" USING btree ("submitted" bool_ops);--> statement-breakpoint
CREATE INDEX "student_activity_user_id_idx" ON "student_activity" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "data_migration_data_id_idx" ON "data_migration" USING btree ("data_id" text_ops);--> statement-breakpoint
CREATE INDEX "data_migration_school_id_idx" ON "data_migration" USING btree ("school_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "prompt_completed_at_idx" ON "prompt" USING btree ("completedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "prompt_created_at_idx" ON "prompt" USING btree ("createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "prompt_created_by_idx" ON "prompt" USING btree ("createdBy" uuid_ops);--> statement-breakpoint
CREATE INDEX "prompt_feat_type_idx" ON "prompt" USING btree ("feat_type" text_ops);--> statement-breakpoint
CREATE INDEX "prompt_status_idx" ON "prompt" USING btree ("status" text_ops);
*/