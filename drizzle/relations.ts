import { relations } from "drizzle-orm/relations";
import { classCard, chatbox, classWorkCategory, activities, term, users, attachments, activityWithTags, tags, attendance, departments, sections, classrooms, schools, chatboxMessages, subjects, grading, post, postComment, sectionQuestions, questions, studentActivity, quizEvidence, schoolMariadDb, studentAnswers, activityBadge, schoolBadge, notificationDevice, studentBadge, notification, chatboxMembers, participants, prompt } from "./schema";

export const chatboxRelations = relations(chatbox, ({one, many}) => ({
	classCard: one(classCard, {
		fields: [chatbox.classCardId],
		references: [classCard.id]
	}),
	chatboxMessages: many(chatboxMessages),
	chatboxMembers: many(chatboxMembers),
}));

export const classCardRelations = relations(classCard, ({one, many}) => ({
	chatboxes: many(chatbox),
	classWorkCategories: many(classWorkCategory),
	activities: many(activities),
	attendances: many(attendance),
	section: one(sections, {
		fields: [classCard.sectionId],
		references: [sections.id]
	}),
	classroom: one(classrooms, {
		fields: [classCard.classroomId],
		references: [classrooms.id]
	}),
	subject: one(subjects, {
		fields: [classCard.subjectId],
		references: [subjects.id]
	}),
	terms: many(term),
	gradings: many(grading),
	schoolBadges: many(schoolBadge),
	studentBadges: many(studentBadge),
	posts: many(post),
	participants: many(participants),
}));

export const classWorkCategoryRelations = relations(classWorkCategory, ({one, many}) => ({
	classCard: one(classCard, {
		fields: [classWorkCategory.classCardId],
		references: [classCard.id]
	}),
	activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({one, many}) => ({
	classCard: one(classCard, {
		fields: [activities.classCardId],
		references: [classCard.id]
	}),
	classWorkCategory: one(classWorkCategory, {
		fields: [activities.classWorkCategoryId],
		references: [classWorkCategory.id]
	}),
	term: one(term, {
		fields: [activities.termId],
		references: [term.id]
	}),
	user: one(users, {
		fields: [activities.createdBy],
		references: [users.id]
	}),
	activityWithTags: many(activityWithTags),
	questions: many(questions),
	sectionQuestions: many(sectionQuestions),
	activityBadges: many(activityBadge),
	studentBadges: many(studentBadge),
	studentActivities: many(studentActivity),
}));

export const termRelations = relations(term, ({one, many}) => ({
	activities: many(activities),
	classCard: one(classCard, {
		fields: [term.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [term.createdBy],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	activities: many(activities),
	attachments: many(attachments),
	attendances: many(attendance),
	classrooms_adviserId: many(classrooms, {
		relationName: "classrooms_adviserId_users_id"
	}),
	classrooms_assistantAdviserId: many(classrooms, {
		relationName: "classrooms_assistantAdviserId_users_id"
	}),
	chatboxMessages: many(chatboxMessages),
	terms: many(term),
	gradings: many(grading),
	postComments: many(postComment),
	activityBadges: many(activityBadge),
	notificationDevices: many(notificationDevice),
	schoolBadges: many(schoolBadge),
	studentBadges_userId: many(studentBadge, {
		relationName: "studentBadge_userId_users_id"
	}),
	studentBadges_createdBy: many(studentBadge, {
		relationName: "studentBadge_createdBy_users_id"
	}),
	notifications: many(notification),
	chatboxMembers: many(chatboxMembers),
	posts: many(post),
	participants: many(participants),
	studentActivities_userId: many(studentActivity, {
		relationName: "studentActivity_userId_users_id"
	}),
	studentActivities_gradedBy: many(studentActivity, {
		relationName: "studentActivity_gradedBy_users_id"
	}),
	prompts: many(prompt),
}));

export const attachmentsRelations = relations(attachments, ({one}) => ({
	user: one(users, {
		fields: [attachments.createdBy],
		references: [users.id]
	}),
}));

export const activityWithTagsRelations = relations(activityWithTags, ({one}) => ({
	activity: one(activities, {
		fields: [activityWithTags.activityId],
		references: [activities.id]
	}),
	tag: one(tags, {
		fields: [activityWithTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	activityWithTags: many(activityWithTags),
}));

export const attendanceRelations = relations(attendance, ({one}) => ({
	user: one(users, {
		fields: [attendance.userId],
		references: [users.id]
	}),
	classCard: one(classCard, {
		fields: [attendance.classCardId],
		references: [classCard.id]
	}),
}));

export const sectionsRelations = relations(sections, ({one, many}) => ({
	department: one(departments, {
		fields: [sections.departmentId],
		references: [departments.id]
	}),
	classrooms: many(classrooms),
	classCards: many(classCard),
}));

export const departmentsRelations = relations(departments, ({many}) => ({
	sections: many(sections),
}));

export const classroomsRelations = relations(classrooms, ({one, many}) => ({
	section: one(sections, {
		fields: [classrooms.sectionId],
		references: [sections.id]
	}),
	school: one(schools, {
		fields: [classrooms.schoolId],
		references: [schools.id]
	}),
	user_adviserId: one(users, {
		fields: [classrooms.adviserId],
		references: [users.id],
		relationName: "classrooms_adviserId_users_id"
	}),
	user_assistantAdviserId: one(users, {
		fields: [classrooms.assistantAdviserId],
		references: [users.id],
		relationName: "classrooms_assistantAdviserId_users_id"
	}),
	classCards: many(classCard),
}));

export const schoolsRelations = relations(schools, ({many}) => ({
	classrooms: many(classrooms),
	schoolMariadDbs: many(schoolMariadDb),
	schoolBadges: many(schoolBadge),
}));

export const chatboxMessagesRelations = relations(chatboxMessages, ({one, many}) => ({
	chatbox: one(chatbox, {
		fields: [chatboxMessages.chatBoxId],
		references: [chatbox.id]
	}),
	user: one(users, {
		fields: [chatboxMessages.senderId],
		references: [users.id]
	}),
	chatboxMembers: many(chatboxMembers),
}));

export const subjectsRelations = relations(subjects, ({many}) => ({
	classCards: many(classCard),
}));

export const gradingRelations = relations(grading, ({one}) => ({
	classCard: one(classCard, {
		fields: [grading.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [grading.userId],
		references: [users.id]
	}),
}));

export const postCommentRelations = relations(postComment, ({one}) => ({
	post: one(post, {
		fields: [postComment.postId],
		references: [post.id]
	}),
	user: one(users, {
		fields: [postComment.createdBy],
		references: [users.id]
	}),
}));

export const postRelations = relations(post, ({one, many}) => ({
	postComments: many(postComment),
	classCard: one(classCard, {
		fields: [post.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [post.createdBy],
		references: [users.id]
	}),
}));

export const questionsRelations = relations(questions, ({one, many}) => ({
	sectionQuestion: one(sectionQuestions, {
		fields: [questions.sectionQuestionsId],
		references: [sectionQuestions.id]
	}),
	activity: one(activities, {
		fields: [questions.activitiesId],
		references: [activities.id]
	}),
	studentAnswers: many(studentAnswers),
}));

export const sectionQuestionsRelations = relations(sectionQuestions, ({one, many}) => ({
	questions: many(questions),
	activity: one(activities, {
		fields: [sectionQuestions.activitiesId],
		references: [activities.id]
	}),
}));

export const quizEvidenceRelations = relations(quizEvidence, ({one}) => ({
	studentActivity: one(studentActivity, {
		fields: [quizEvidence.studentActivityId],
		references: [studentActivity.id]
	}),
}));

export const studentActivityRelations = relations(studentActivity, ({one, many}) => ({
	quizEvidences: many(quizEvidence),
	studentAnswers: many(studentAnswers),
	activity: one(activities, {
		fields: [studentActivity.activityId],
		references: [activities.id]
	}),
	user_userId: one(users, {
		fields: [studentActivity.userId],
		references: [users.id],
		relationName: "studentActivity_userId_users_id"
	}),
	user_gradedBy: one(users, {
		fields: [studentActivity.gradedBy],
		references: [users.id],
		relationName: "studentActivity_gradedBy_users_id"
	}),
}));

export const schoolMariadDbRelations = relations(schoolMariadDb, ({one}) => ({
	school: one(schools, {
		fields: [schoolMariadDb.schoolId],
		references: [schools.id]
	}),
}));

export const studentAnswersRelations = relations(studentAnswers, ({one}) => ({
	question: one(questions, {
		fields: [studentAnswers.questionId],
		references: [questions.id]
	}),
	studentActivity: one(studentActivity, {
		fields: [studentAnswers.studentActivityId],
		references: [studentActivity.id]
	}),
}));

export const activityBadgeRelations = relations(activityBadge, ({one}) => ({
	activity: one(activities, {
		fields: [activityBadge.activityId],
		references: [activities.id]
	}),
	schoolBadge: one(schoolBadge, {
		fields: [activityBadge.schoolBadgeId],
		references: [schoolBadge.id]
	}),
	user: one(users, {
		fields: [activityBadge.createdBy],
		references: [users.id]
	}),
}));

export const schoolBadgeRelations = relations(schoolBadge, ({one, many}) => ({
	activityBadges: many(activityBadge),
	school: one(schools, {
		fields: [schoolBadge.schoolId],
		references: [schools.id]
	}),
	user: one(users, {
		fields: [schoolBadge.createdBy],
		references: [users.id]
	}),
	classCard: one(classCard, {
		fields: [schoolBadge.classCardId],
		references: [classCard.id]
	}),
	studentBadges: many(studentBadge),
}));

export const notificationDeviceRelations = relations(notificationDevice, ({one}) => ({
	user: one(users, {
		fields: [notificationDevice.userId],
		references: [users.id]
	}),
}));

export const studentBadgeRelations = relations(studentBadge, ({one}) => ({
	activity: one(activities, {
		fields: [studentBadge.activityId],
		references: [activities.id]
	}),
	user_userId: one(users, {
		fields: [studentBadge.userId],
		references: [users.id],
		relationName: "studentBadge_userId_users_id"
	}),
	schoolBadge: one(schoolBadge, {
		fields: [studentBadge.schoolBadgeId],
		references: [schoolBadge.id]
	}),
	user_createdBy: one(users, {
		fields: [studentBadge.createdBy],
		references: [users.id],
		relationName: "studentBadge_createdBy_users_id"
	}),
	classCard: one(classCard, {
		fields: [studentBadge.classCardId],
		references: [classCard.id]
	}),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user: one(users, {
		fields: [notification.userId],
		references: [users.id]
	}),
}));

export const chatboxMembersRelations = relations(chatboxMembers, ({one}) => ({
	chatbox: one(chatbox, {
		fields: [chatboxMembers.chatboxId],
		references: [chatbox.id]
	}),
	user: one(users, {
		fields: [chatboxMembers.userId],
		references: [users.id]
	}),
	chatboxMessage: one(chatboxMessages, {
		fields: [chatboxMembers.lastMessageId],
		references: [chatboxMessages.id]
	}),
}));

export const participantsRelations = relations(participants, ({one}) => ({
	user: one(users, {
		fields: [participants.userId],
		references: [users.id]
	}),
	classCard: one(classCard, {
		fields: [participants.classCardId],
		references: [classCard.id]
	}),
}));

export const promptRelations = relations(prompt, ({one}) => ({
	user: one(users, {
		fields: [prompt.createdBy],
		references: [users.id]
	}),
}));