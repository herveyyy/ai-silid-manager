-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `activities` (
	`id` char(36) NOT NULL,
	`classCardId` char(36),
	`type` enum('assignment','quiz','materials') NOT NULL,
	`options` json,
	`title` text NOT NULL,
	`points` int NOT NULL,
	`published_date` datetime(3) NOT NULL DEFAULT (now(3)),
	`deadline` datetime(3) NOT NULL DEFAULT (now(3)),
	`topic` text,
	`classWorkCategoryId` char(36),
	`termId` char(36),
	`availableToStudents` json,
	`notAvailableToStudents` json,
	`bank` tinyint(1) NOT NULL DEFAULT 0,
	`archive` tinyint(1) NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`createdBy` char(36),
	`meetingLink` text,
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_badge` (
	`id` char(36) NOT NULL,
	`activity_id` char(36) NOT NULL,
	`school_badge_id` char(36) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`created_by` char(36) NOT NULL,
	CONSTRAINT `activity_badge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_with_tags` (
	`id` char(36) NOT NULL,
	`activityId` char(36),
	`tagId` char(36),
	`createdAt` datetime(3) DEFAULT (now(3)),
	CONSTRAINT `activity_with_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_models` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`status` varchar(255) NOT NULL DEFAULT 'active',
	`in_cost_value` text,
	`out_cost_value` text,
	CONSTRAINT `ai_models_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` char(36) NOT NULL,
	`parent_id` text NOT NULL,
	`file_path` varchar(255) NOT NULL DEFAULT '',
	`file_type` varchar(255) NOT NULL DEFAULT '',
	`parentType` enum('question','section-question','student-answer','class-card','post-comment','profile','post','quiz-evidence','assignment','materials','attendance','school-badge','chatbox','chatbox-message','content','content-question'),
	`is_deleted` tinyint(1) DEFAULT 0,
	`is_used` tinyint(1) DEFAULT 1,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`created_by` char(36),
	`file_size` decimal(20,6) DEFAULT '0.000000',
	`file_name` varchar(255) NOT NULL DEFAULT '',
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`class_card_id` char(36) NOT NULL,
	`type` enum('in','out') NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificate_format` (
	`id` char(36) NOT NULL,
	`print_format` text NOT NULL,
	`course_id` char(36) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `certificate_format_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`format_view` text NOT NULL,
	`url_code` text,
	`status` text,
	`release_at` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbox` (
	`id` char(36) NOT NULL,
	`classCardId` char(36),
	`groupName` text,
	`groupIcon` text,
	`createdAt` datetime(3) NOT NULL DEFAULT (now(3)),
	`updatedAt` datetime(3) NOT NULL DEFAULT (now(3)),
	`archive` tinyint(1) DEFAULT 0,
	CONSTRAINT `chatbox_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbox_members` (
	`id` char(36) NOT NULL,
	`chatboxId` char(36),
	`userId` char(36),
	`createdAt` datetime(3) NOT NULL DEFAULT (now(3)),
	`updatedAt` datetime(3) NOT NULL DEFAULT (now(3)),
	`lastSeen` datetime(3) DEFAULT (now(3)),
	`lastMessageId` char(36),
	CONSTRAINT `chatbox_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbox_messages` (
	`id` char(36) NOT NULL,
	`chatBoxId` char(36),
	`senderId` char(36),
	`message` text,
	`emojis` json,
	`createdAt` datetime(3) DEFAULT (now(3)),
	`updatedAt` datetime(3) DEFAULT (now(3)),
	`pinned` tinyint(1) DEFAULT 0,
	CONSTRAINT `chatbox_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `class_card` (
	`id` char(36) NOT NULL,
	`sectionId` char(36),
	`classroomId` char(36) NOT NULL,
	`period` text NOT NULL,
	`semester` text,
	`subjectId` char(36),
	`start_time` datetime(3),
	`end_time` datetime(3),
	`bgImage` text,
	`color` varchar(255) NOT NULL DEFAULT '#f48618ff',
	`archive` tinyint(1) NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`meeting_link` text,
	`request_posting` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `class_card_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `class_work_category` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`weight` decimal(20,6) NOT NULL,
	`classCardId` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`archive` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `class_work_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classrooms` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`sectionId` char(36),
	`schoolId` char(36) NOT NULL,
	`adviserId` char(36),
	`assistantAdviserId` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `classrooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_questions` (
	`id` char(36) NOT NULL,
	`content_id` char(36) NOT NULL,
	`question` text NOT NULL,
	`options` json,
	`choices` json NOT NULL,
	`answer` json NOT NULL,
	`points` int NOT NULL,
	`created_by` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`question_type` enum('multiple-choice','true-false','identification','essay','enumeration','matching','attachments'),
	CONSTRAINT `content_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contents` (
	`id` char(36) NOT NULL,
	`lesson_id` char(36) NOT NULL,
	`content` text NOT NULL,
	`content_type` enum('question','exercise','content') NOT NULL,
	`options` json,
	`duration` int NOT NULL,
	`order` int NOT NULL,
	`created_by` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `contents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course` (
	`id` char(36) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`bg_img` text,
	`color` text,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`created_by` char(36),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`reference_url` text,
	`url_reference` text,
	`schoolCodes` json,
	CONSTRAINT `course_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_level_tag` (
	`id` char(36) NOT NULL,
	`course_id` char(36) NOT NULL,
	`level_tag_id` char(36) NOT NULL,
	CONSTRAINT `course_level_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_permission` (
	`id` char(36) NOT NULL,
	`course_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`accessRole` enum('admin','editor','viewer') NOT NULL,
	CONSTRAINT `course_permission_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_school` (
	`id` char(36) NOT NULL,
	`course_id` char(36) NOT NULL,
	`school_id` char(36) NOT NULL,
	CONSTRAINT `course_school_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_topic` (
	`id` char(36) NOT NULL,
	`course_id` char(36) NOT NULL,
	`topic_id` char(36) NOT NULL,
	CONSTRAINT `course_topic_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `data_migration` (
	`id` char(36) NOT NULL,
	`school_id` char(36) NOT NULL,
	`data_id` text,
	`data` json,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `data_migration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grading` (
	`id` char(36) NOT NULL,
	`classCardId` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`gradeJson` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (now(3)),
	`updatedAt` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `grading_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` char(36) NOT NULL,
	`course_id` char(36) NOT NULL,
	`header` text NOT NULL,
	`description` text NOT NULL,
	`resources` json,
	`order` int NOT NULL,
	`prerequisite_lesson_id` char(36),
	`created_by` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`url_reference` text,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `level_tags` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `level_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`image` text,
	`link` text,
	`is_read` tinyint(1) DEFAULT 0,
	`type` enum('chatbox','activity','activity-bank','assignment','quiz','materials','class-card','post','quiz-evidence','attendance','school-badge','grade') NOT NULL,
	`created_at` datetime(3) DEFAULT (now(3)),
	`updated_at` datetime(3) DEFAULT (now(3)),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_device` (
	`id` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`device_type` enum('android','ios','web') NOT NULL,
	`endpoint` text NOT NULL,
	`p256Dh` text NOT NULL,
	`auth` text NOT NULL,
	`device_info` json DEFAULT ('{}'),
	`created_at` datetime(3) DEFAULT (now(3)),
	`updated_at` datetime(3) DEFAULT (now(3)),
	CONSTRAINT `notification_device_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`classCardId` char(36) NOT NULL,
	`created_at` datetime(3) DEFAULT (now(3)),
	`updated_at` datetime(3) DEFAULT (now(3)),
	`enabled` tinyint(1) NOT NULL DEFAULT 1,
	`has_permit` tinyint(1) NOT NULL DEFAULT 1,
	CONSTRAINT `participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` char(36) NOT NULL,
	`classCardId` char(36) NOT NULL,
	`message` text,
	`pinned` tinyint(1) DEFAULT 0,
	`isScheduledPost` tinyint(1) DEFAULT 0,
	`schedulePost` datetime(3),
	`userPostType` enum('student','teacher','admin','partner'),
	`archive` tinyint(1) DEFAULT 0,
	`createdAt` datetime(3) DEFAULT (now(3)),
	`updatedAt` datetime(3) DEFAULT (now(3)),
	`createdBy` char(36),
	`isRequestPosting` tinyint(1) DEFAULT 0,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_comment` (
	`id` char(36) NOT NULL,
	`postId` char(36) NOT NULL,
	`message` text,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`createdBy` char(36),
	CONSTRAINT `post_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prompt` (
	`id` char(36) NOT NULL,
	`feat_type` text NOT NULL,
	`user_prompt` text NOT NULL,
	`prompt_title` text,
	`result` text,
	`ai_model_name` text,
	`createdAt` datetime(3) DEFAULT (now(3)),
	`updatedAt` datetime(3) DEFAULT (now(3)),
	`completedAt` datetime(3),
	`token_ai_value` int,
	`credits_spent` int,
	`status` text NOT NULL,
	`createdBy` char(36) NOT NULL,
	`bypassed_process` tinyint(1) NOT NULL DEFAULT 0,
	`cost_value` text,
	CONSTRAINT `prompt_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` char(36) NOT NULL,
	`sectionQuestionsId` char(36),
	`activitiesId` char(36),
	`description` text,
	`points` int DEFAULT 0,
	`type` enum('multiple-choice','true-false','identification','essay','enumeration','matching','attachments'),
	`checkForPunctuationsAndSpecialChar` tinyint(1) DEFAULT 0,
	`checkForCaseSensitiveAnswers` tinyint(1) DEFAULT 0,
	`shuffleChoicesDuringTest` tinyint(1) DEFAULT 0,
	`choices` json,
	`answer` json,
	`order` int DEFAULT 0,
	`bank` tinyint(1) DEFAULT 0,
	`createdAt` datetime(3) DEFAULT (now(3)),
	`updatedAt` datetime(3) DEFAULT (now(3)),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_evidence` (
	`id` char(36) NOT NULL,
	`student_activity_id` char(36) NOT NULL,
	`description` text,
	`evidence_capture_type` enum('front','screen') NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `quiz_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `request_cache` (
	`id` char(36) NOT NULL,
	`requestToken` text NOT NULL,
	`expiredDate` datetime(3) NOT NULL,
	CONSTRAINT `request_cache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `school_badge` (
	`id` char(36) NOT NULL,
	`school_id` char(36) NOT NULL,
	`enable` tinyint(1) NOT NULL DEFAULT 1,
	`name` text NOT NULL,
	`description` text,
	`created_by` char(36) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`class_card_id` char(36),
	`shared` tinyint(1) NOT NULL DEFAULT 0,
	`limit` int DEFAULT 9999,
	`default` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `school_badge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `school_mariad_db` (
	`id` char(36) NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`database` text NOT NULL,
	`host` text NOT NULL,
	`port` int,
	`schoolId` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `school_mariad_db_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`school_code` varchar(50) NOT NULL,
	`username` varchar(100),
	`password` varchar(100),
	`site` text NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`secret` varchar(100),
	`api_key` varchar(100),
	`ai_feat` tinyint(1) NOT NULL DEFAULT 0,
	`unlimited_storage` tinyint(1) NOT NULL DEFAULT 0,
	`unlimited_token` tinyint(1) NOT NULL DEFAULT 0,
	`token_limit` int NOT NULL DEFAULT 10000,
	`storage_limit` int NOT NULL DEFAULT 10000,
	`default_ai_model_id` char(36),
	CONSTRAINT `schools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sectionQuestions` (
	`id` char(36) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`order` int DEFAULT 0,
	`shuffleQuestions` tinyint(1) DEFAULT 0,
	`bank` tinyint(1) DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`activitiesId` char(36),
	CONSTRAINT `sectionQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`level` text NOT NULL,
	`departmentId` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_activity` (
	`id` char(36) NOT NULL,
	`activityId` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`score` int DEFAULT 0,
	`submitted` tinyint(1) DEFAULT 0,
	`countSubmitted` int DEFAULT 1,
	`submitDate` datetime(3) DEFAULT (now(3)),
	`graded` tinyint(1) DEFAULT 0,
	`createdAt` datetime(3) DEFAULT (now(3)),
	`updatedAt` datetime(3) DEFAULT (now(3)),
	`gradedBy` char(36),
	`available` tinyint(1) DEFAULT 1,
	`gradedDate` datetime(3) DEFAULT (now(3)),
	`startedDate` datetime(3) DEFAULT (now(3)),
	`feedback` json,
	`teacherFeedback` json,
	CONSTRAINT `student_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_answers` (
	`id` char(36) NOT NULL,
	`questionId` char(36) NOT NULL,
	`studentActivityId` char(36) NOT NULL,
	`answers` json,
	`points` int DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `student_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_badge` (
	`id` char(36) NOT NULL,
	`activity_id` char(36),
	`user_id` char(36) NOT NULL,
	`school_badge_id` char(36) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`created_by` char(36) NOT NULL,
	`class_card_id` char(36),
	CONSTRAINT `student_badge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_hub_flash_card` (
	`id` char(36) NOT NULL,
	`note_id` char(36) NOT NULL,
	`question_description` text NOT NULL,
	`question_answer` text NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `student_hub_flash_card_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_hub_note` (
	`id` char(36) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_by` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `student_hub_note_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` char(36) NOT NULL,
	`name` text,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `takers_answers` (
	`id` char(36) NOT NULL,
	`content_question_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`answers` json NOT NULL,
	`is_correct` tinyint(1),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `takers_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `takers_feedback` (
	`id` char(36) NOT NULL,
	`course_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`comment` text,
	`rating` int,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `takers_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `takers_progress` (
	`id` char(36) NOT NULL,
	`content_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`is_seen` tinyint(1) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `takers_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `takers_topics` (
	`id` char(36) NOT NULL,
	`topic_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `takers_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `term` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`class_card_id` char(36),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`created_by` char(36),
	`archive` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `term_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` enum('student','teacher','admin','partner') NOT NULL,
	`created_at` datetime(3) DEFAULT (now(3)),
	`imageUrl` text,
	`password` text,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_classCardId_class_card_id_fk` FOREIGN KEY (`classCardId`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_classWorkCategoryId_class_work_category_id_fk` FOREIGN KEY (`classWorkCategoryId`) REFERENCES `class_work_category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_termId_term_id_fk` FOREIGN KEY (`termId`) REFERENCES `term`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_badge` ADD CONSTRAINT `activity_badge_activity_id_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_badge` ADD CONSTRAINT `activity_badge_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_badge` ADD CONSTRAINT `activity_badge_school_badge_id_school_badge_id_fk` FOREIGN KEY (`school_badge_id`) REFERENCES `school_badge`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_with_tags` ADD CONSTRAINT `activity_with_tags_activityId_activities_id_fk` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_with_tags` ADD CONSTRAINT `activity_with_tags_tagId_tags_id_fk` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_class_card_id_class_card_id_fk` FOREIGN KEY (`class_card_id`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificate_format` ADD CONSTRAINT `certificate_format_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbox` ADD CONSTRAINT `chatbox_classCardId_class_card_id_fk` FOREIGN KEY (`classCardId`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbox_members` ADD CONSTRAINT `chatbox_members_chatboxId_chatbox_id_fk` FOREIGN KEY (`chatboxId`) REFERENCES `chatbox`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbox_members` ADD CONSTRAINT `chatbox_members_lastMessageId_chatbox_messages_id_fk` FOREIGN KEY (`lastMessageId`) REFERENCES `chatbox_messages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbox_members` ADD CONSTRAINT `chatbox_members_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbox_messages` ADD CONSTRAINT `chatbox_messages_chatBoxId_chatbox_id_fk` FOREIGN KEY (`chatBoxId`) REFERENCES `chatbox`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatbox_messages` ADD CONSTRAINT `chatbox_messages_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_card` ADD CONSTRAINT `class_card_classroomId_classrooms_id_fk` FOREIGN KEY (`classroomId`) REFERENCES `classrooms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_card` ADD CONSTRAINT `class_card_sectionId_sections_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_card` ADD CONSTRAINT `class_card_subjectId_subjects_id_fk` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_work_category` ADD CONSTRAINT `class_work_category_classCardId_class_card_id_fk` FOREIGN KEY (`classCardId`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_adviserId_users_id_fk` FOREIGN KEY (`adviserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_assistantAdviserId_users_id_fk` FOREIGN KEY (`assistantAdviserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_sectionId_sections_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_questions` ADD CONSTRAINT `content_questions_content_id_contents_id_fk` FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_questions` ADD CONSTRAINT `content_questions_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contents` ADD CONSTRAINT `contents_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contents` ADD CONSTRAINT `contents_lesson_id_lessons_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course` ADD CONSTRAINT `course_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_level_tag` ADD CONSTRAINT `course_level_tag_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_level_tag` ADD CONSTRAINT `course_level_tag_level_tag_id_level_tags_id_fk` FOREIGN KEY (`level_tag_id`) REFERENCES `level_tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_permission` ADD CONSTRAINT `course_permission_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_permission` ADD CONSTRAINT `course_permission_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_school` ADD CONSTRAINT `course_school_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_school` ADD CONSTRAINT `course_school_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_topic` ADD CONSTRAINT `course_topic_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_topic` ADD CONSTRAINT `course_topic_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grading` ADD CONSTRAINT `grading_classCardId_class_card_id_fk` FOREIGN KEY (`classCardId`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grading` ADD CONSTRAINT `grading_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_prerequisite_lesson_id_lessons_id_fk` FOREIGN KEY (`prerequisite_lesson_id`) REFERENCES `lessons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_device` ADD CONSTRAINT `notification_device_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participants` ADD CONSTRAINT `participants_classCardId_class_card_id_fk` FOREIGN KEY (`classCardId`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participants` ADD CONSTRAINT `participants_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post` ADD CONSTRAINT `post_classCardId_class_card_id_fk` FOREIGN KEY (`classCardId`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post` ADD CONSTRAINT `post_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_postId_post_id_fk` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompt` ADD CONSTRAINT `prompt_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_activitiesId_activities_id_fk` FOREIGN KEY (`activitiesId`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_sectionQuestionsId_sectionQuestions_id_fk` FOREIGN KEY (`sectionQuestionsId`) REFERENCES `sectionQuestions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_evidence` ADD CONSTRAINT `quiz_evidence_student_activity_id_student_activity_id_fk` FOREIGN KEY (`student_activity_id`) REFERENCES `student_activity`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_badge` ADD CONSTRAINT `school_badge_class_card_id_class_card_id_fk` FOREIGN KEY (`class_card_id`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_badge` ADD CONSTRAINT `school_badge_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_badge` ADD CONSTRAINT `school_badge_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_mariad_db` ADD CONSTRAINT `school_mariad_db_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schools` ADD CONSTRAINT `schools_default_ai_model_id_ai_models_id_fk` FOREIGN KEY (`default_ai_model_id`) REFERENCES `ai_models`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sectionQuestions` ADD CONSTRAINT `sectionQuestions_activitiesId_activities_id_fk` FOREIGN KEY (`activitiesId`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sections` ADD CONSTRAINT `sections_departmentId_departments_id_fk` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_activity` ADD CONSTRAINT `student_activity_activityId_activities_id_fk` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_activity` ADD CONSTRAINT `student_activity_gradedBy_users_id_fk` FOREIGN KEY (`gradedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_activity` ADD CONSTRAINT `student_activity_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_answers` ADD CONSTRAINT `student_answers_questionId_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_answers` ADD CONSTRAINT `student_answers_studentActivityId_student_activity_id_fk` FOREIGN KEY (`studentActivityId`) REFERENCES `student_activity`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_badge` ADD CONSTRAINT `student_badge_activity_id_activities_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_badge` ADD CONSTRAINT `student_badge_class_card_id_class_card_id_fk` FOREIGN KEY (`class_card_id`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_badge` ADD CONSTRAINT `student_badge_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_badge` ADD CONSTRAINT `student_badge_school_badge_id_school_badge_id_fk` FOREIGN KEY (`school_badge_id`) REFERENCES `school_badge`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_badge` ADD CONSTRAINT `student_badge_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_hub_flash_card` ADD CONSTRAINT `student_hub_flash_card_note_id_student_hub_note_id_fk` FOREIGN KEY (`note_id`) REFERENCES `student_hub_note`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_hub_note` ADD CONSTRAINT `student_hub_note_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_answers` ADD CONSTRAINT `takers_answers_content_question_id_content_questions_id_fk` FOREIGN KEY (`content_question_id`) REFERENCES `content_questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_answers` ADD CONSTRAINT `takers_answers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_feedback` ADD CONSTRAINT `takers_feedback_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_feedback` ADD CONSTRAINT `takers_feedback_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_progress` ADD CONSTRAINT `takers_progress_content_id_contents_id_fk` FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_progress` ADD CONSTRAINT `takers_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_topics` ADD CONSTRAINT `takers_topics_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `takers_topics` ADD CONSTRAINT `takers_topics_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `term` ADD CONSTRAINT `term_class_card_id_class_card_id_fk` FOREIGN KEY (`class_card_id`) REFERENCES `class_card`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `term` ADD CONSTRAINT `term_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
*/