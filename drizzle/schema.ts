import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, char, mysqlEnum, json, text, int, datetime, varchar, decimal, bigint, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const activities = mysqlTable("activities", {
	id: char({ length: 36 }).notNull(),
	classCardId: char({ length: 36 }).references(() => classCard.id),
	type: mysqlEnum(['assignment', 'quiz', 'materials']).notNull(),
	options: json(),
	title: text().notNull(),
	points: int().notNull(),
	publishedDate: datetime("published_date", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	deadline: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	topic: text(),
	classWorkCategoryId: char({ length: 36 }).references(() => classWorkCategory.id),
	termId: char({ length: 36 }).references(() => term.id),
	availableToStudents: json(),
	notAvailableToStudents: json(),
	bank: tinyint().default(0).notNull(),
	archive: tinyint().default(0).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char({ length: 36 }).references(() => users.id),
	meetingLink: text(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "activities_id" }),
	]);

export const activityBadge = mysqlTable("activity_badge", {
	id: char({ length: 36 }).notNull(),
	activityId: char("activity_id", { length: 36 }).notNull().references(() => activities.id),
	schoolBadgeId: char("school_badge_id", { length: 36 }).notNull().references(() => schoolBadge.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char("created_by", { length: 36 }).notNull().references(() => users.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "activity_badge_id" }),
	]);

export const activityWithTags = mysqlTable("activity_with_tags", {
	id: char({ length: 36 }).notNull(),
	activityId: char({ length: 36 }).references(() => activities.id),
	tagId: char({ length: 36 }).references(() => tags.id),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "activity_with_tags_id" }),
	]);

export const aiModels = mysqlTable("ai_models", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	status: varchar({ length: 255 }).default('active').notNull(),
	inCostValue: text("in_cost_value"),
	outCostValue: text("out_cost_value"),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ai_models_id" }),
	]);

export const attachments = mysqlTable("attachments", {
	id: char({ length: 36 }).notNull(),
	parentId: text("parent_id").notNull(),
	filePath: varchar("file_path", { length: 255 }).default('').notNull(),
	fileType: varchar("file_type", { length: 255 }).default('').notNull(),
	parentType: mysqlEnum(['question', 'section-question', 'student-answer', 'class-card', 'post-comment', 'profile', 'post', 'quiz-evidence', 'assignment', 'materials', 'attendance', 'school-badge', 'chatbox', 'chatbox-message', 'content', 'content-question']),
	isDeleted: tinyint("is_deleted").default(0),
	isUsed: tinyint("is_used").default(1),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	fileSize: decimal("file_size", { precision: 20, scale: 6 }).default('0.000000'),
	fileName: varchar("file_name", { length: 255 }).default('').notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "attachments_id" }),
	]);

export const attendance = mysqlTable("attendance", {
	id: char({ length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	classCardId: char("class_card_id", { length: 36 }).notNull().references(() => classCard.id),
	type: mysqlEnum(['in', 'out']).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "attendance_id" }),
	]);

export const certificateFormat = mysqlTable("certificate_format", {
	id: char({ length: 36 }).notNull(),
	printFormat: text("print_format").notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "certificate_format_id" }),
	]);

export const certificates = mysqlTable("certificates", {
	id: char({ length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	formatView: text("format_view").notNull(),
	urlCode: text("url_code"),
	status: text(),
	releaseAt: datetime("release_at", { mode: 'string', fsp: 3 }),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "certificates_id" }),
	]);

export const chatbox = mysqlTable("chatbox", {
	id: char({ length: 36 }).notNull(),
	classCardId: char({ length: 36 }).references(() => classCard.id),
	groupName: text(),
	groupIcon: text(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	archive: tinyint().default(0),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "chatbox_id" }),
	]);

export const chatboxMembers = mysqlTable("chatbox_members", {
	id: char({ length: 36 }).notNull(),
	chatboxId: char({ length: 36 }).references(() => chatbox.id),
	userId: char({ length: 36 }).references(() => users.id),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	lastSeen: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	lastMessageId: char({ length: 36 }).references(() => chatboxMessages.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "chatbox_members_id" }),
	]);

export const chatboxMessages = mysqlTable("chatbox_messages", {
	id: char({ length: 36 }).notNull(),
	chatBoxId: char({ length: 36 }).references(() => chatbox.id),
	senderId: char({ length: 36 }).references(() => users.id),
	message: text(),
	emojis: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	pinned: tinyint().default(0),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "chatbox_messages_id" }),
	]);

export const classCard = mysqlTable("class_card", {
	id: char({ length: 36 }).notNull(),
	sectionId: char({ length: 36 }).references(() => sections.id),
	classroomId: char({ length: 36 }).notNull().references(() => classrooms.id),
	period: text().notNull(),
	semester: text(),
	subjectId: char({ length: 36 }).references(() => subjects.id),
	startTime: datetime("start_time", { mode: 'string', fsp: 3 }),
	endTime: datetime("end_time", { mode: 'string', fsp: 3 }),
	bgImage: text(),
	color: varchar({ length: 255 }).default('#f48618ff').notNull(),
	archive: tinyint().default(0).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	meetingLink: text("meeting_link"),
	requestPosting: tinyint("request_posting").default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "class_card_id" }),
	]);

export const classWorkCategory = mysqlTable("class_work_category", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	weight: decimal({ precision: 20, scale: 6 }).notNull(),
	classCardId: char({ length: 36 }).references(() => classCard.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	archive: tinyint().default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "class_work_category_id" }),
	]);

export const classrooms = mysqlTable("classrooms", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	sectionId: char({ length: 36 }).references(() => sections.id),
	schoolId: char({ length: 36 }).notNull().references(() => schools.id),
	adviserId: char({ length: 36 }).references(() => users.id),
	assistantAdviserId: char({ length: 36 }).references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "classrooms_id" }),
	]);

export const contentQuestions = mysqlTable("content_questions", {
	id: char({ length: 36 }).notNull(),
	contentId: char("content_id", { length: 36 }).notNull().references(() => contents.id),
	question: text().notNull(),
	options: json(),
	choices: json().notNull(),
	answer: json().notNull(),
	points: int().notNull(),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	questionType: mysqlEnum("question_type", ['multiple-choice', 'true-false', 'identification', 'essay', 'enumeration', 'matching', 'attachments']),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "content_questions_id" }),
	]);

export const contents = mysqlTable("contents", {
	id: char({ length: 36 }).notNull(),
	lessonId: char("lesson_id", { length: 36 }).notNull().references(() => lessons.id),
	content: text().notNull(),
	contentType: mysqlEnum("content_type", ['question', 'exercise', 'content']).notNull(),
	options: json(),
	duration: int().notNull(),
	order: int().notNull(),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "contents_id" }),
	]);

export const course = mysqlTable("course", {
	id: char({ length: 36 }).notNull(),
	title: text().notNull(),
	description: text().notNull(),
	bgImg: text("bg_img"),
	color: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	status: mysqlEnum(['draft', 'published', 'archived']).default('draft').notNull(),
	referenceUrl: text("reference_url"),
	urlReference: text("url_reference"),
	schoolCodes: json(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "course_id" }),
	]);

export const courseLevelTag = mysqlTable("course_level_tag", {
	id: char({ length: 36 }).notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	levelTagId: char("level_tag_id", { length: 36 }).notNull().references(() => levelTags.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "course_level_tag_id" }),
	]);

export const coursePermission = mysqlTable("course_permission", {
	id: char({ length: 36 }).notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	accessRole: mysqlEnum(['admin', 'editor', 'viewer']).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "course_permission_id" }),
	]);

export const courseSchool = mysqlTable("course_school", {
	id: char({ length: 36 }).notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	schoolId: char("school_id", { length: 36 }).notNull().references(() => schools.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "course_school_id" }),
	]);

export const courseTopic = mysqlTable("course_topic", {
	id: char({ length: 36 }).notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	topicId: char("topic_id", { length: 36 }).notNull().references(() => topics.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "course_topic_id" }),
	]);

export const dataMigration = mysqlTable("data_migration", {
	id: char({ length: 36 }).notNull(),
	schoolId: char("school_id", { length: 36 }).notNull(),
	dataId: text("data_id"),
	data: json(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "data_migration_id" }),
	]);

export const dbErrorLogger = mysqlTable("db_error_logger", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	sqlState: char("sql_state", { length: 5 }),
	errorMessage: text("error_message").notNull(),
	detail: text(),
	failedQuery: text("failed_query"),
	referenceTable: varchar("reference_table", { length: 100 }),
	erroredByUser: varchar("errored_by_user", { length: 100 }),
	applicationName: varchar("application_name", { length: 100 }),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "db_error_logger_id" }),
	]);

export const departments = mysqlTable("departments", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "departments_id" }),
	]);

export const grading = mysqlTable("grading", {
	id: char({ length: 36 }).notNull(),
	classCardId: char({ length: 36 }).notNull().references(() => classCard.id),
	userId: char({ length: 36 }).notNull().references(() => users.id),
	gradeJson: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "grading_id" }),
	]);

export const lessons = mysqlTable("lessons", {
	id: char({ length: 36 }).notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	header: text().notNull(),
	description: text().notNull(),
	resources: json(),
	order: int().notNull(),
	prerequisiteLessonId: char("prerequisite_lesson_id", { length: 36 }),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	urlReference: text("url_reference"),
},
	(table) => [
		foreignKey({
			columns: [table.prerequisiteLessonId],
			foreignColumns: [table.id],
			name: "lessons_prerequisite_lesson_id_lessons_id_fk"
		}),
		primaryKey({ columns: [table.id], name: "lessons_id" }),
	]);

export const levelTags = mysqlTable("level_tags", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "level_tags_id" }),
	]);

export const notification = mysqlTable("notification", {
	id: char({ length: 36 }).notNull(),
	userId: char({ length: 36 }).notNull().references(() => users.id),
	title: text().notNull(),
	body: text().notNull(),
	image: text(),
	link: text(),
	isRead: tinyint("is_read").default(0),
	type: mysqlEnum(['chatbox', 'activity', 'activity-bank', 'assignment', 'quiz', 'materials', 'class-card', 'post', 'quiz-evidence', 'attendance', 'school-badge', 'grade']).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "notification_id" }),
	]);

export const notificationDevice = mysqlTable("notification_device", {
	id: char({ length: 36 }).notNull(),
	userId: char({ length: 36 }).notNull().references(() => users.id),
	deviceType: mysqlEnum("device_type", ['android', 'ios', 'web']).notNull(),
	endpoint: text().notNull(),
	p256Dh: text().notNull(),
	auth: text().notNull(),
	deviceInfo: json("device_info").default({}),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "notification_device_id" }),
	]);

export const participants = mysqlTable("participants", {
	id: char({ length: 36 }).notNull(),
	userId: char({ length: 36 }).notNull().references(() => users.id),
	classCardId: char({ length: 36 }).notNull().references(() => classCard.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	enabled: tinyint().default(1).notNull(),
	hasPermit: tinyint("has_permit").default(1).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "participants_id" }),
	]);

export const post = mysqlTable("post", {
	id: char({ length: 36 }).notNull(),
	classCardId: char({ length: 36 }).notNull().references(() => classCard.id),
	message: text(),
	pinned: tinyint().default(0),
	isScheduledPost: tinyint().default(0),
	schedulePost: datetime({ mode: 'string', fsp: 3 }),
	userPostType: mysqlEnum(['student', 'teacher', 'admin', 'partner']),
	archive: tinyint().default(0),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	createdBy: char({ length: 36 }).references(() => users.id),
	isRequestPosting: tinyint().default(0),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "post_id" }),
	]);

export const postComment = mysqlTable("post_comment", {
	id: char({ length: 36 }).notNull(),
	postId: char({ length: 36 }).notNull().references(() => post.id),
	message: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char({ length: 36 }).references(() => users.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "post_comment_id" }),
	]);

export const prompt = mysqlTable("prompt", {
	id: char({ length: 36 }).notNull(),
	featType: text("feat_type").notNull(),
	userPrompt: text("user_prompt").notNull(),
	promptTitle: text("prompt_title"),
	result: text(),
	aiModelName: text("ai_model_name"),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	completedAt: datetime({ mode: 'string', fsp: 3 }),
	tokenAiValue: int("token_ai_value"),
	creditsSpent: int("credits_spent"),
	status: text().notNull(),
	createdBy: char({ length: 36 }).notNull().references(() => users.id),
	bypassedProcess: tinyint("bypassed_process").default(0).notNull(),
	costValue: text("cost_value"),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "prompt_id" }),
	]);

export const questions = mysqlTable("questions", {
	id: char({ length: 36 }).notNull(),
	sectionQuestionsId: char({ length: 36 }).references(() => sectionQuestions.id),
	activitiesId: char({ length: 36 }).references(() => activities.id),
	description: text(),
	points: int().default(0),
	type: mysqlEnum(['multiple-choice', 'true-false', 'identification', 'essay', 'enumeration', 'matching', 'attachments']),
	checkForPunctuationsAndSpecialChar: tinyint().default(0),
	checkForCaseSensitiveAnswers: tinyint().default(0),
	shuffleChoicesDuringTest: tinyint().default(0),
	choices: json(),
	answer: json(),
	order: int().default(0),
	bank: tinyint().default(0),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "questions_id" }),
	]);

export const quizEvidence = mysqlTable("quiz_evidence", {
	id: char({ length: 36 }).notNull(),
	studentActivityId: char("student_activity_id", { length: 36 }).notNull().references(() => studentActivity.id),
	description: text(),
	evidenceCaptureType: mysqlEnum("evidence_capture_type", ['front', 'screen']).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "quiz_evidence_id" }),
	]);

export const requestCache = mysqlTable("request_cache", {
	id: char({ length: 36 }).notNull(),
	requestToken: text().notNull(),
	expiredDate: datetime({ mode: 'string', fsp: 3 }).notNull(),
	userId: char("user_id", { length: 36 }).references(() => users.id),
	schoolCode: char("school_code", { length: 50 }),
	isClassSync: tinyint("is_class_sync").default(0),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "request_cache_id" }),
	]);

export const schoolBadge = mysqlTable("school_badge", {
	id: char({ length: 36 }).notNull(),
	schoolId: char("school_id", { length: 36 }).notNull().references(() => schools.id),
	enable: tinyint().default(1).notNull(),
	name: text().notNull(),
	description: text(),
	createdBy: char("created_by", { length: 36 }).notNull().references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	classCardId: char("class_card_id", { length: 36 }).references(() => classCard.id),
	shared: tinyint().default(0).notNull(),
	limit: int().default(9999),
	default: tinyint().default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "school_badge_id" }),
	]);

export const schoolMariadDb = mysqlTable("school_mariad_db", {
	id: char({ length: 36 }).notNull(),
	username: text().notNull(),
	password: text().notNull(),
	database: text().notNull(),
	host: text().notNull(),
	port: int(),
	schoolId: char({ length: 36 }).references(() => schools.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "school_mariad_db_id" }),
	]);

export const schools = mysqlTable("schools", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	schoolCode: varchar("school_code", { length: 50 }).notNull(),
	username: varchar({ length: 100 }),
	password: varchar({ length: 100 }),
	site: text().notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	secret: varchar({ length: 100 }),
	apiKey: varchar("api_key", { length: 100 }),
	aiFeat: tinyint("ai_feat").default(0).notNull(),
	unlimitedStorage: tinyint("unlimited_storage").default(0).notNull(),
	unlimitedToken: tinyint("unlimited_token").default(0).notNull(),
	tokenLimit: int("token_limit").default(10000).notNull(),
	storageLimit: int("storage_limit").default(10000).notNull(),
	defaultAiModelId: char("default_ai_model_id", { length: 36 }).references(() => aiModels.id),
	enrichmentFeat: tinyint("enrichment_feat").default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "schools_id" }),
	]);

export const sectionQuestions = mysqlTable("sectionQuestions", {
	id: char({ length: 36 }).notNull(),
	title: text().notNull(),
	description: text(),
	order: int().default(0),
	shuffleQuestions: tinyint().default(0),
	bank: tinyint().default(0),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	activitiesId: char({ length: 36 }).references(() => activities.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sectionQuestions_id" }),
	]);

export const sections = mysqlTable("sections", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	level: text().notNull(),
	departmentId: char({ length: 36 }).references(() => departments.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sections_id" }),
	]);

export const studentActivity = mysqlTable("student_activity", {
	id: char({ length: 36 }).notNull(),
	activityId: char({ length: 36 }).notNull().references(() => activities.id),
	userId: char({ length: 36 }).notNull().references(() => users.id),
	score: int().default(0),
	submitted: tinyint().default(0),
	countSubmitted: int().default(1),
	submitDate: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	graded: tinyint().default(0),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	gradedBy: char({ length: 36 }).references(() => users.id),
	available: tinyint().default(1),
	gradedDate: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	startedDate: datetime({ mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	feedback: json(),
	teacherFeedback: json(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "student_activity_id" }),
	]);

export const studentAnswers = mysqlTable("student_answers", {
	id: char({ length: 36 }).notNull(),
	questionId: char({ length: 36 }).notNull().references(() => questions.id),
	studentActivityId: char({ length: 36 }).notNull().references(() => studentActivity.id),
	answers: json(),
	points: int().default(0),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "student_answers_id" }),
	]);

export const studentBadge = mysqlTable("student_badge", {
	id: char({ length: 36 }).notNull(),
	activityId: char("activity_id", { length: 36 }).references(() => activities.id),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	schoolBadgeId: char("school_badge_id", { length: 36 }).notNull().references(() => schoolBadge.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char("created_by", { length: 36 }).notNull().references(() => users.id),
	classCardId: char("class_card_id", { length: 36 }).references(() => classCard.id),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "student_badge_id" }),
	]);

export const studentHubFlashCard = mysqlTable("student_hub_flash_card", {
	id: char({ length: 36 }).notNull(),
	noteId: char("note_id", { length: 36 }).notNull().references(() => studentHubNote.id),
	questionDescription: text("question_description").notNull(),
	questionAnswer: text("question_answer").notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "student_hub_flash_card_id" }),
	]);

export const studentHubNote = mysqlTable("student_hub_note", {
	id: char({ length: 36 }).notNull(),
	title: text().notNull(),
	description: text(),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	subject: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "student_hub_note_id" }),
	]);

export const subjects = mysqlTable("subjects", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	code: text().notNull(),
	description: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "subjects_id" }),
	]);

export const tags = mysqlTable("tags", {
	id: char({ length: 36 }).notNull(),
	name: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "tags_id" }),
	]);

export const takersAnswers = mysqlTable("takers_answers", {
	id: char({ length: 36 }).notNull(),
	contentQuestionId: char("content_question_id", { length: 36 }).notNull().references(() => contentQuestions.id),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	answers: json().notNull(),
	isCorrect: tinyint("is_correct"),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "takers_answers_id" }),
	]);

export const takersFeedback = mysqlTable("takers_feedback", {
	id: char({ length: 36 }).notNull(),
	courseId: char("course_id", { length: 36 }).notNull().references(() => course.id),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	comment: text(),
	rating: int(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "takers_feedback_id" }),
	]);

export const takersProgress = mysqlTable("takers_progress", {
	id: char({ length: 36 }).notNull(),
	contentId: char("content_id", { length: 36 }).notNull().references(() => contents.id),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	isSeen: tinyint("is_seen").notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "takers_progress_id" }),
	]);

export const takersTopics = mysqlTable("takers_topics", {
	id: char({ length: 36 }).notNull(),
	topicId: char("topic_id", { length: 36 }).notNull().references(() => topics.id),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "takers_topics_id" }),
	]);

export const term = mysqlTable("term", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	classCardId: char("class_card_id", { length: 36 }).references(() => classCard.id),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	createdBy: char("created_by", { length: 36 }).references(() => users.id),
	archive: tinyint().default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "term_id" }),
	]);

export const topics = mysqlTable("topics", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
	updatedAt: datetime("updated_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "topics_id" }),
	]);

export const users = mysqlTable("users", {
	id: char({ length: 36 }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	role: mysqlEnum(['student', 'teacher', 'admin', 'partner']).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(now(3))`),
	imageUrl: text(),
	password: text(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "users_id" }),
	]);
