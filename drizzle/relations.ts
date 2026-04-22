import { relations } from "drizzle-orm/relations";
import { classCard, activities, classWorkCategory, users, term, activityBadge, schoolBadge, activityWithTags, tags, attachments, attendance, course, certificateFormat, certificates, chatbox, chatboxMembers, chatboxMessages, classrooms, sections, subjects, schools, contents, contentQuestions, lessons, courseLevelTag, levelTags, coursePermission, courseSchool, courseTopic, topics, grading, notification, notificationDevice, participants, post, postComment, prompt, questions, sectionQuestions, studentActivity, quizEvidence, schoolMariadDb, aiModels, departments, studentAnswers, studentBadge, studentHubNote, studentHubFlashCard, takersAnswers, takersFeedback, takersProgress, takersTopics } from "./schema";

export const activitiesRelations = relations(activities, ({ one, many }) => ({
	classCard: one(classCard, {
		fields: [activities.classCardId],
		references: [classCard.id]
	}),
	classWorkCategory: one(classWorkCategory, {
		fields: [activities.classWorkCategoryId],
		references: [classWorkCategory.id]
	}),
	user: one(users, {
		fields: [activities.createdBy],
		references: [users.id]
	}),
	term: one(term, {
		fields: [activities.termId],
		references: [term.id]
	}),
	activityBadges: many(activityBadge),
	activityWithTags: many(activityWithTags),
	questions: many(questions),
	sectionQuestions: many(sectionQuestions),
	studentActivities: many(studentActivity),
	studentBadges: many(studentBadge),
}));

export const classCardRelations = relations(classCard, ({ one, many }) => ({
	activities: many(activities),
	attendances: many(attendance),
	chatboxes: many(chatbox),
	classroom: one(classrooms, {
		fields: [classCard.classroomId],
		references: [classrooms.id]
	}),
	section: one(sections, {
		fields: [classCard.sectionId],
		references: [sections.id]
	}),
	subject: one(subjects, {
		fields: [classCard.subjectId],
		references: [subjects.id]
	}),
	classWorkCategories: many(classWorkCategory),
	gradings: many(grading),
	participants: many(participants),
	posts: many(post),
	schoolBadges: many(schoolBadge),
	studentBadges: many(studentBadge),
	terms: many(term),
}));

export const classWorkCategoryRelations = relations(classWorkCategory, ({ one, many }) => ({
	activities: many(activities),
	classCard: one(classCard, {
		fields: [classWorkCategory.classCardId],
		references: [classCard.id]
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	activities: many(activities),
	activityBadges: many(activityBadge),
	attachments: many(attachments),
	attendances: many(attendance),
	certificates: many(certificates),
	chatboxMembers: many(chatboxMembers),
	chatboxMessages: many(chatboxMessages),
	classrooms_adviserId: many(classrooms, {
		relationName: "classrooms_adviserId_users_id"
	}),
	classrooms_assistantAdviserId: many(classrooms, {
		relationName: "classrooms_assistantAdviserId_users_id"
	}),
	contentQuestions: many(contentQuestions),
	contents: many(contents),
	courses: many(course),
	coursePermissions: many(coursePermission),
	gradings: many(grading),
	lessons: many(lessons),
	notifications: many(notification),
	notificationDevices: many(notificationDevice),
	participants: many(participants),
	posts: many(post),
	postComments: many(postComment),
	prompts: many(prompt),
	schoolBadges: many(schoolBadge),
	studentActivities_gradedBy: many(studentActivity, {
		relationName: "studentActivity_gradedBy_users_id"
	}),
	studentActivities_userId: many(studentActivity, {
		relationName: "studentActivity_userId_users_id"
	}),
	studentBadges_createdBy: many(studentBadge, {
		relationName: "studentBadge_createdBy_users_id"
	}),
	studentBadges_userId: many(studentBadge, {
		relationName: "studentBadge_userId_users_id"
	}),
	studentHubNotes: many(studentHubNote),
	takersAnswers: many(takersAnswers),
	takersFeedbacks: many(takersFeedback),
	takersProgresses: many(takersProgress),
	takersTopics: many(takersTopics),
	terms: many(term),
}));

export const termRelations = relations(term, ({ one, many }) => ({
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

export const activityBadgeRelations = relations(activityBadge, ({ one }) => ({
	activity: one(activities, {
		fields: [activityBadge.activityId],
		references: [activities.id]
	}),
	user: one(users, {
		fields: [activityBadge.createdBy],
		references: [users.id]
	}),
	schoolBadge: one(schoolBadge, {
		fields: [activityBadge.schoolBadgeId],
		references: [schoolBadge.id]
	}),
}));

export const schoolBadgeRelations = relations(schoolBadge, ({ one, many }) => ({
	activityBadges: many(activityBadge),
	classCard: one(classCard, {
		fields: [schoolBadge.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [schoolBadge.createdBy],
		references: [users.id]
	}),
	school: one(schools, {
		fields: [schoolBadge.schoolId],
		references: [schools.id]
	}),
	studentBadges: many(studentBadge),
}));

export const activityWithTagsRelations = relations(activityWithTags, ({ one }) => ({
	activity: one(activities, {
		fields: [activityWithTags.activityId],
		references: [activities.id]
	}),
	tag: one(tags, {
		fields: [activityWithTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	activityWithTags: many(activityWithTags),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
	user: one(users, {
		fields: [attachments.createdBy],
		references: [users.id]
	}),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
	classCard: one(classCard, {
		fields: [attendance.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [attendance.userId],
		references: [users.id]
	}),
}));

export const certificateFormatRelations = relations(certificateFormat, ({ one }) => ({
	course: one(course, {
		fields: [certificateFormat.courseId],
		references: [course.id]
	}),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
	certificateFormats: many(certificateFormat),
	user: one(users, {
		fields: [course.createdBy],
		references: [users.id]
	}),
	courseLevelTags: many(courseLevelTag),
	coursePermissions: many(coursePermission),
	courseSchools: many(courseSchool),
	courseTopics: many(courseTopic),
	lessons: many(lessons),
	takersFeedbacks: many(takersFeedback),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
	user: one(users, {
		fields: [certificates.userId],
		references: [users.id]
	}),
}));

export const chatboxRelations = relations(chatbox, ({ one, many }) => ({
	classCard: one(classCard, {
		fields: [chatbox.classCardId],
		references: [classCard.id]
	}),
	chatboxMembers: many(chatboxMembers),
	chatboxMessages: many(chatboxMessages),
}));

export const chatboxMembersRelations = relations(chatboxMembers, ({ one }) => ({
	chatbox: one(chatbox, {
		fields: [chatboxMembers.chatboxId],
		references: [chatbox.id]
	}),
	chatboxMessage: one(chatboxMessages, {
		fields: [chatboxMembers.lastMessageId],
		references: [chatboxMessages.id]
	}),
	user: one(users, {
		fields: [chatboxMembers.userId],
		references: [users.id]
	}),
}));

export const chatboxMessagesRelations = relations(chatboxMessages, ({ one, many }) => ({
	chatboxMembers: many(chatboxMembers),
	chatbox: one(chatbox, {
		fields: [chatboxMessages.chatBoxId],
		references: [chatbox.id]
	}),
	user: one(users, {
		fields: [chatboxMessages.senderId],
		references: [users.id]
	}),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
	classCards: many(classCard),
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
	school: one(schools, {
		fields: [classrooms.schoolId],
		references: [schools.id]
	}),
	section: one(sections, {
		fields: [classrooms.sectionId],
		references: [sections.id]
	}),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	classCards: many(classCard),
	classrooms: many(classrooms),
	department: one(departments, {
		fields: [sections.departmentId],
		references: [departments.id]
	}),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
	classCards: many(classCard),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
	classrooms: many(classrooms),
	courseSchools: many(courseSchool),
	schoolBadges: many(schoolBadge),
	schoolMariadDbs: many(schoolMariadDb),
	aiModel: one(aiModels, {
		fields: [schools.defaultAiModelId],
		references: [aiModels.id]
	}),
}));

export const contentQuestionsRelations = relations(contentQuestions, ({ one, many }) => ({
	content: one(contents, {
		fields: [contentQuestions.contentId],
		references: [contents.id]
	}),
	user: one(users, {
		fields: [contentQuestions.createdBy],
		references: [users.id]
	}),
	takersAnswers: many(takersAnswers),
}));

export const contentsRelations = relations(contents, ({ one, many }) => ({
	contentQuestions: many(contentQuestions),
	user: one(users, {
		fields: [contents.createdBy],
		references: [users.id]
	}),
	lesson: one(lessons, {
		fields: [contents.lessonId],
		references: [lessons.id]
	}),
	takersProgresses: many(takersProgress),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
	contents: many(contents),
	course: one(course, {
		fields: [lessons.courseId],
		references: [course.id]
	}),
	user: one(users, {
		fields: [lessons.createdBy],
		references: [users.id]
	}),
	lesson: one(lessons, {
		fields: [lessons.prerequisiteLessonId],
		references: [lessons.id],
		relationName: "lessons_prerequisiteLessonId_lessons_id"
	}),
	lessons: many(lessons, {
		relationName: "lessons_prerequisiteLessonId_lessons_id"
	}),
}));

export const courseLevelTagRelations = relations(courseLevelTag, ({ one }) => ({
	course: one(course, {
		fields: [courseLevelTag.courseId],
		references: [course.id]
	}),
	levelTag: one(levelTags, {
		fields: [courseLevelTag.levelTagId],
		references: [levelTags.id]
	}),
}));

export const levelTagsRelations = relations(levelTags, ({ many }) => ({
	courseLevelTags: many(courseLevelTag),
}));

export const coursePermissionRelations = relations(coursePermission, ({ one }) => ({
	course: one(course, {
		fields: [coursePermission.courseId],
		references: [course.id]
	}),
	user: one(users, {
		fields: [coursePermission.userId],
		references: [users.id]
	}),
}));

export const courseSchoolRelations = relations(courseSchool, ({ one }) => ({
	course: one(course, {
		fields: [courseSchool.courseId],
		references: [course.id]
	}),
	school: one(schools, {
		fields: [courseSchool.schoolId],
		references: [schools.id]
	}),
}));

export const courseTopicRelations = relations(courseTopic, ({ one }) => ({
	course: one(course, {
		fields: [courseTopic.courseId],
		references: [course.id]
	}),
	topic: one(topics, {
		fields: [courseTopic.topicId],
		references: [topics.id]
	}),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
	courseTopics: many(courseTopic),
	takersTopics: many(takersTopics),
}));

export const gradingRelations = relations(grading, ({ one }) => ({
	classCard: one(classCard, {
		fields: [grading.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [grading.userId],
		references: [users.id]
	}),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
	user: one(users, {
		fields: [notification.userId],
		references: [users.id]
	}),
}));

export const notificationDeviceRelations = relations(notificationDevice, ({ one }) => ({
	user: one(users, {
		fields: [notificationDevice.userId],
		references: [users.id]
	}),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
	classCard: one(classCard, {
		fields: [participants.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [participants.userId],
		references: [users.id]
	}),
}));

export const postRelations = relations(post, ({ one, many }) => ({
	classCard: one(classCard, {
		fields: [post.classCardId],
		references: [classCard.id]
	}),
	user: one(users, {
		fields: [post.createdBy],
		references: [users.id]
	}),
	postComments: many(postComment),
}));

export const postCommentRelations = relations(postComment, ({ one }) => ({
	user: one(users, {
		fields: [postComment.createdBy],
		references: [users.id]
	}),
	post: one(post, {
		fields: [postComment.postId],
		references: [post.id]
	}),
}));

export const promptRelations = relations(prompt, ({ one }) => ({
	user: one(users, {
		fields: [prompt.createdBy],
		references: [users.id]
	}),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
	activity: one(activities, {
		fields: [questions.activitiesId],
		references: [activities.id]
	}),
	sectionQuestion: one(sectionQuestions, {
		fields: [questions.sectionQuestionsId],
		references: [sectionQuestions.id]
	}),
	studentAnswers: many(studentAnswers),
}));

export const sectionQuestionsRelations = relations(sectionQuestions, ({ one, many }) => ({
	questions: many(questions),
	activity: one(activities, {
		fields: [sectionQuestions.activitiesId],
		references: [activities.id]
	}),
}));

export const quizEvidenceRelations = relations(quizEvidence, ({ one }) => ({
	studentActivity: one(studentActivity, {
		fields: [quizEvidence.studentActivityId],
		references: [studentActivity.id]
	}),
}));

export const studentActivityRelations = relations(studentActivity, ({ one, many }) => ({
	quizEvidences: many(quizEvidence),
	activity: one(activities, {
		fields: [studentActivity.activityId],
		references: [activities.id]
	}),
	user_gradedBy: one(users, {
		fields: [studentActivity.gradedBy],
		references: [users.id],
		relationName: "studentActivity_gradedBy_users_id"
	}),
	user_userId: one(users, {
		fields: [studentActivity.userId],
		references: [users.id],
		relationName: "studentActivity_userId_users_id"
	}),
	studentAnswers: many(studentAnswers),
}));

export const schoolMariadDbRelations = relations(schoolMariadDb, ({ one }) => ({
	school: one(schools, {
		fields: [schoolMariadDb.schoolId],
		references: [schools.id]
	}),
}));

export const aiModelsRelations = relations(aiModels, ({ many }) => ({
	schools: many(schools),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
	sections: many(sections),
}));

export const studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
	question: one(questions, {
		fields: [studentAnswers.questionId],
		references: [questions.id]
	}),
	studentActivity: one(studentActivity, {
		fields: [studentAnswers.studentActivityId],
		references: [studentActivity.id]
	}),
}));

export const studentBadgeRelations = relations(studentBadge, ({ one }) => ({
	activity: one(activities, {
		fields: [studentBadge.activityId],
		references: [activities.id]
	}),
	classCard: one(classCard, {
		fields: [studentBadge.classCardId],
		references: [classCard.id]
	}),
	user_createdBy: one(users, {
		fields: [studentBadge.createdBy],
		references: [users.id],
		relationName: "studentBadge_createdBy_users_id"
	}),
	schoolBadge: one(schoolBadge, {
		fields: [studentBadge.schoolBadgeId],
		references: [schoolBadge.id]
	}),
	user_userId: one(users, {
		fields: [studentBadge.userId],
		references: [users.id],
		relationName: "studentBadge_userId_users_id"
	}),
}));

export const studentHubFlashCardRelations = relations(studentHubFlashCard, ({ one }) => ({
	studentHubNote: one(studentHubNote, {
		fields: [studentHubFlashCard.noteId],
		references: [studentHubNote.id]
	}),
}));

export const studentHubNoteRelations = relations(studentHubNote, ({ one, many }) => ({
	studentHubFlashCards: many(studentHubFlashCard),
	user: one(users, {
		fields: [studentHubNote.createdBy],
		references: [users.id]
	}),
}));

export const takersAnswersRelations = relations(takersAnswers, ({ one }) => ({
	contentQuestion: one(contentQuestions, {
		fields: [takersAnswers.contentQuestionId],
		references: [contentQuestions.id]
	}),
	user: one(users, {
		fields: [takersAnswers.userId],
		references: [users.id]
	}),
}));

export const takersFeedbackRelations = relations(takersFeedback, ({ one }) => ({
	course: one(course, {
		fields: [takersFeedback.courseId],
		references: [course.id]
	}),
	user: one(users, {
		fields: [takersFeedback.userId],
		references: [users.id]
	}),
}));

export const takersProgressRelations = relations(takersProgress, ({ one }) => ({
	content: one(contents, {
		fields: [takersProgress.contentId],
		references: [contents.id]
	}),
	user: one(users, {
		fields: [takersProgress.userId],
		references: [users.id]
	}),
}));

export const takersTopicsRelations = relations(takersTopics, ({ one }) => ({
	topic: one(topics, {
		fields: [takersTopics.topicId],
		references: [topics.id]
	}),
	user: one(users, {
		fields: [takersTopics.userId],
		references: [users.id]
	}),
}));