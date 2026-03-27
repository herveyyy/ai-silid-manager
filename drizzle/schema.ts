import {
    pgTable,
    index,
    foreignKey,
    uuid,
    text,
    timestamp,
    boolean,
    numeric,
    json,
    integer,
    varchar,
    jsonb,
    unique,
    pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const activityType = pgEnum("activity_type", [
    "assignment",
    "quiz",
    "materials",
]);
export const attachmentType = pgEnum("attachment_type", [
    "question",
    "section-question",
    "student-answer",
    "class-card",
    "post-comment",
    "profile",
    "post",
    "quiz-evidence",
    "assignment",
    "materials",
    "attendance",
    "school-badge",
    "chatbox",
    "chatbox-message",
    "content",
    "content-question",
]);
export const attendanceType = pgEnum("attendance_type", ["in", "out"]);
export const contentType = pgEnum("content_type", [
    "question",
    "exercise",
    "content",
]);
export const courseStatus = pgEnum("course_status", [
    "draft",
    "published",
    "archived",
]);
export const deviceType = pgEnum("device_type", ["android", "ios", "web"]);
export const evidenceCaptureType = pgEnum("evidence_capture_type", [
    "front",
    "screen",
]);
export const notificationType = pgEnum("notification_type", [
    "chatbox",
    "activity",
    "activity-bank",
    "assignment",
    "quiz",
    "materials",
    "class-card",
    "post",
    "quiz-evidence",
    "attendance",
    "school-badge",
    "grade",
]);
export const questionType = pgEnum("question_type", [
    "multiple-choice",
    "true-false",
    "identification",
    "essay",
    "enumeration",
    "matching",
    "attachments",
]);
export const userRoleType = pgEnum("user_role_type", [
    "student",
    "teacher",
    "admin",
    "partner",
]);

export const chatbox = pgTable(
    "chatbox",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        classCardId: uuid(),
        groupName: text(),
        groupIcon: text(),
        createdAt: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        archive: boolean().default(false),
    },
    (table) => [
        index("chatbox_archive_idx").using(
            "btree",
            table.archive.asc().nullsLast().op("bool_ops"),
        ),
        index("chatbox_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("chatbox_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "chatbox_classCardId_class_card_id_fk",
        }),
    ],
);

export const classWorkCategory = pgTable(
    "class_work_category",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        weight: numeric().notNull(),
        classCardId: uuid(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        archive: boolean().default(false).notNull(),
    },
    (table) => [
        index("class_work_category_archive_idx").using(
            "btree",
            table.archive.asc().nullsLast().op("bool_ops"),
        ),
        index("class_work_category_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("class_work_category_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "class_work_category_classCardId_class_card_id_fk",
        }),
    ],
);

export const activities = pgTable(
    "activities",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        classCardId: uuid(),
        type: activityType().notNull(),
        options: json(),
        title: text().notNull(),
        points: integer().notNull(),
        publishedDate: timestamp("published_date", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        deadline: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        topic: text(),
        classWorkCategoryId: uuid(),
        termId: uuid(),
        availableToStudents: json(),
        notAvailableToStudents: json(),
        bank: boolean().default(false).notNull(),
        archive: boolean().default(false).notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        createdBy: uuid(),
        meetingLink: text(),
    },
    (table) => [
        index("activities_archive_idx").using(
            "btree",
            table.archive.asc().nullsLast().op("bool_ops"),
        ),
        index("activities_bank_idx").using(
            "btree",
            table.bank.asc().nullsLast().op("bool_ops"),
        ),
        index("activities_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("activities_class_work_category_id_idx").using(
            "btree",
            table.classWorkCategoryId.asc().nullsLast().op("uuid_ops"),
        ),
        index("activities_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("activities_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("activities_deadline_idx").using(
            "btree",
            table.deadline.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("activities_published_date_idx").using(
            "btree",
            table.publishedDate.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("activities_term_id_idx").using(
            "btree",
            table.termId.asc().nullsLast().op("uuid_ops"),
        ),
        index("activities_title_idx").using(
            "btree",
            table.title.asc().nullsLast().op("text_ops"),
        ),
        index("activities_type_idx").using(
            "btree",
            table.type.asc().nullsLast().op("enum_ops"),
        ),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "activities_classCardId_class_card_id_fk",
        }),
        foreignKey({
            columns: [table.classWorkCategoryId],
            foreignColumns: [classWorkCategory.id],
            name: "activities_classWorkCategoryId_class_work_category_id_fk",
        }),
        foreignKey({
            columns: [table.termId],
            foreignColumns: [term.id],
            name: "activities_termId_term_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "activities_createdBy_users_id_fk",
        }),
    ],
);

export const attachments = pgTable(
    "attachments",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        parentId: text("parent_id").notNull(),
        filePath: text("file_path").default("").notNull(),
        fileType: text("file_type").default("").notNull(),
        parentType: attachmentType(),
        isDeleted: boolean("is_deleted").default(false),
        isUsed: boolean("is_used").default(true),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        createdBy: uuid("created_by"),
        fileSize: numeric("file_size").default("0"),
        fileName: text("file_name").default("").notNull(),
    },
    (table) => [
        index("attachments_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("attachments_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("attachments_is_deleted_idx").using(
            "btree",
            table.isDeleted.asc().nullsLast().op("bool_ops"),
        ),
        index("attachments_is_used_idx").using(
            "btree",
            table.isUsed.asc().nullsLast().op("bool_ops"),
        ),
        index("attachments_parent_id_idx").using(
            "btree",
            table.parentId.asc().nullsLast().op("text_ops"),
        ),
        index("attachments_parent_type_idx").using(
            "btree",
            table.parentType.asc().nullsLast().op("enum_ops"),
        ),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "attachments_created_by_users_id_fk",
        }),
    ],
);

export const activityWithTags = pgTable(
    "activity_with_tags",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        activityId: uuid(),
        tagId: uuid(),
        createdAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
    },
    (table) => [
        index("activity_with_tags_activity_id_idx").using(
            "btree",
            table.activityId.asc().nullsLast().op("uuid_ops"),
        ),
        index("activity_with_tags_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("activity_with_tags_tag_id_idx").using(
            "btree",
            table.tagId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.activityId],
            foreignColumns: [activities.id],
            name: "activity_with_tags_activityId_activities_id_fk",
        }),
        foreignKey({
            columns: [table.tagId],
            foreignColumns: [tags.id],
            name: "activity_with_tags_tagId_tags_id_fk",
        }),
    ],
);

export const tags = pgTable(
    "tags",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("tags_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("tags_name_idx").using(
            "btree",
            table.name.asc().nullsLast().op("text_ops"),
        ),
    ],
);

export const attendance = pgTable(
    "attendance",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid("user_id").notNull(),
        classCardId: uuid("class_card_id").notNull(),
        type: attendanceType().notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("attendance_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("attendance_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("attendance_type_idx").using(
            "btree",
            table.type.asc().nullsLast().op("enum_ops"),
        ),
        index("attendance_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "attendance_user_id_users_id_fk",
        }),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "attendance_class_card_id_class_card_id_fk",
        }),
    ],
);

export const sections = pgTable(
    "sections",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        level: text().notNull(),
        departmentId: uuid(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        }).notNull(),
    },
    (table) => [
        index("sections_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("sections_department_id_idx").using(
            "btree",
            table.departmentId.asc().nullsLast().op("uuid_ops"),
        ),
        index("sections_level_idx").using(
            "btree",
            table.level.asc().nullsLast().op("text_ops"),
        ),
        index("sections_name_idx").using(
            "btree",
            table.name.asc().nullsLast().op("text_ops"),
        ),
        foreignKey({
            columns: [table.departmentId],
            foreignColumns: [departments.id],
            name: "sections_departmentId_departments_id_fk",
        }),
    ],
);

export const classrooms = pgTable(
    "classrooms",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        sectionId: uuid(),
        schoolId: uuid().notNull(),
        adviserId: uuid(),
        assistantAdviserId: uuid(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("classrooms_adviser_id_idx").using(
            "btree",
            table.adviserId.asc().nullsLast().op("uuid_ops"),
        ),
        index("classrooms_assistant_adviser_id_idx").using(
            "btree",
            table.assistantAdviserId.asc().nullsLast().op("uuid_ops"),
        ),
        index("classrooms_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("classrooms_school_id_idx").using(
            "btree",
            table.schoolId.asc().nullsLast().op("uuid_ops"),
        ),
        index("classrooms_section_id_idx").using(
            "btree",
            table.sectionId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.sectionId],
            foreignColumns: [sections.id],
            name: "classrooms_sectionId_sections_id_fk",
        }),
        foreignKey({
            columns: [table.schoolId],
            foreignColumns: [schools.id],
            name: "classrooms_schoolId_schools_id_fk",
        }),
        foreignKey({
            columns: [table.adviserId],
            foreignColumns: [users.id],
            name: "classrooms_adviserId_users_id_fk",
        }),
        foreignKey({
            columns: [table.assistantAdviserId],
            foreignColumns: [users.id],
            name: "classrooms_assistantAdviserId_users_id_fk",
        }),
    ],
);

export const subjects = pgTable(
    "subjects",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        code: text().notNull(),
        description: text(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("subjects_code_idx").using(
            "btree",
            table.code.asc().nullsLast().op("text_ops"),
        ),
        index("subjects_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("subjects_name_idx").using(
            "btree",
            table.name.asc().nullsLast().op("text_ops"),
        ),
    ],
);

export const schools = pgTable(
    "schools",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        schoolCode: varchar("school_code", { length: 50 }).notNull(),
        username: varchar({ length: 100 }),
        password: varchar({ length: 100 }),
        site: text().notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        secret: varchar({ length: 100 }),
        apiKey: varchar("api_key", { length: 100 }),
        aiFeat: boolean("ai_feat").default(false).notNull(),
        unlimitedStorage: boolean("unlimited_storage").default(false).notNull(),
        unlimitedToken: boolean("unlimited_token").default(false).notNull(),
        tokenLimit: integer("token_limit").default(10000).notNull(),
        storageLimit: integer("storage_limit").default(10000).notNull(),
        defaultAiModelId: uuid("default_ai_model_id"),
    },
    (table) => [
        index("schools_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("schools_school_code_idx").using(
            "btree",
            table.schoolCode.asc().nullsLast().op("text_ops"),
        ),
        index("schools_username_idx").using(
            "btree",
            table.username.asc().nullsLast().op("text_ops"),
        ),
        foreignKey({
            columns: [table.defaultAiModelId],
            foreignColumns: [aiModels.id],
            name: "schools_default_ai_model_id_ai_models_id_fk",
        }),
    ],
);

export const chatboxMessages = pgTable(
    "chatbox_messages",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        chatBoxId: uuid(),
        senderId: uuid(),
        message: text(),
        emojis: json(),
        createdAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        pinned: boolean().default(false),
    },
    (table) => [
        index("chatbox_messages_chat_box_id_idx").using(
            "btree",
            table.chatBoxId.asc().nullsLast().op("uuid_ops"),
        ),
        index("chatbox_messages_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("chatbox_messages_pinned_idx").using(
            "btree",
            table.pinned.asc().nullsLast().op("bool_ops"),
        ),
        index("chatbox_messages_sender_id_idx").using(
            "btree",
            table.senderId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.chatBoxId],
            foreignColumns: [chatbox.id],
            name: "chatbox_messages_chatBoxId_chatbox_id_fk",
        }),
        foreignKey({
            columns: [table.senderId],
            foreignColumns: [users.id],
            name: "chatbox_messages_senderId_users_id_fk",
        }),
    ],
);

export const classCard = pgTable(
    "class_card",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        sectionId: uuid(),
        classroomId: uuid().notNull(),
        period: text().notNull(),
        semester: text(),
        subjectId: uuid(),
        startTime: timestamp("start_time", {
            withTimezone: true,
            mode: "string",
        }),
        endTime: timestamp("end_time", { withTimezone: true, mode: "string" }),
        bgImage: text(),
        color: text().default("#f48618ff").notNull(),
        archive: boolean().default(false).notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        meetingLink: text("meeting_link"),
        requestPosting: boolean("request_posting").default(false).notNull(),
    },
    (table) => [
        index("class_card_archive_idx").using(
            "btree",
            table.archive.asc().nullsLast().op("bool_ops"),
        ),
        index("class_card_classroom_id_idx").using(
            "btree",
            table.classroomId.asc().nullsLast().op("uuid_ops"),
        ),
        index("class_card_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("class_card_request_posting_idx").using(
            "btree",
            table.requestPosting.asc().nullsLast().op("bool_ops"),
        ),
        index("class_card_section_id_idx").using(
            "btree",
            table.sectionId.asc().nullsLast().op("uuid_ops"),
        ),
        index("class_card_subject_id_idx").using(
            "btree",
            table.subjectId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.sectionId],
            foreignColumns: [sections.id],
            name: "class_card_sectionId_sections_id_fk",
        }),
        foreignKey({
            columns: [table.classroomId],
            foreignColumns: [classrooms.id],
            name: "class_card_classroomId_classrooms_id_fk",
        }),
        foreignKey({
            columns: [table.subjectId],
            foreignColumns: [subjects.id],
            name: "class_card_subjectId_subjects_id_fk",
        }),
    ],
);

export const term = pgTable(
    "term",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        classCardId: uuid("class_card_id"),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        createdBy: uuid("created_by"),
        archive: boolean().default(false).notNull(),
    },
    (table) => [
        index("term_archive_idx").using(
            "btree",
            table.archive.asc().nullsLast().op("bool_ops"),
        ),
        index("term_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("term_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("term_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "term_class_card_id_class_card_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "term_created_by_users_id_fk",
        }),
    ],
);

export const users = pgTable(
    "users",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        email: text().notNull(),
        role: userRoleType().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        imageUrl: text(),
        password: text(),
    },
    (table) => [
        index("users_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamp_ops"),
        ),
        index("users_email_idx").using(
            "btree",
            table.email.asc().nullsLast().op("text_ops"),
        ),
        index("users_role_idx").using(
            "btree",
            table.role.asc().nullsLast().op("enum_ops"),
        ),
    ],
);

export const requestCache = pgTable(
    "request_cache",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        requestToken: text().notNull(),
        expiredDate: timestamp({
            withTimezone: true,
            mode: "string",
        }).notNull(),
    },
    (table) => [
        index("request_cache_expired_date_idx").using(
            "btree",
            table.expiredDate.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("request_cache_request_token_idx").using(
            "btree",
            table.requestToken.asc().nullsLast().op("text_ops"),
        ),
    ],
);

export const grading = pgTable(
    "grading",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        classCardId: uuid().notNull(),
        userId: uuid().notNull(),
        gradeJson: jsonb(),
        createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
        updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    },
    (table) => [
        index("grading_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("grading_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamp_ops"),
        ),
        index("grading_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "grading_classCardId_class_card_id_fk",
        }),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "grading_userId_users_id_fk",
        }),
    ],
);

export const postComment = pgTable(
    "post_comment",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        postId: uuid().notNull(),
        message: text(),
        createdAt: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        createdBy: uuid(),
    },
    (table) => [
        index("post_comment_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("post_comment_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("post_comment_post_id_idx").using(
            "btree",
            table.postId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.postId],
            foreignColumns: [post.id],
            name: "post_comment_postId_post_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "post_comment_createdBy_users_id_fk",
        }),
    ],
);

export const questions = pgTable(
    "questions",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        sectionQuestionsId: uuid(),
        activitiesId: uuid(),
        description: text(),
        points: integer().default(0),
        type: questionType(),
        checkForPunctuationsAndSpecialChar: boolean().default(false),
        checkForCaseSensitiveAnswers: boolean().default(false),
        shuffleChoicesDuringTest: boolean().default(false),
        choices: json(),
        answer: json(),
        order: integer().default(0),
        bank: boolean().default(false),
        createdAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
    },
    (table) => [
        index("questions_activities_id_idx").using(
            "btree",
            table.activitiesId.asc().nullsLast().op("uuid_ops"),
        ),
        index("questions_bank_idx").using(
            "btree",
            table.bank.asc().nullsLast().op("bool_ops"),
        ),
        index("questions_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("questions_order_idx").using(
            "btree",
            table.order.asc().nullsLast().op("int4_ops"),
        ),
        index("questions_section_questions_id_idx").using(
            "btree",
            table.sectionQuestionsId.asc().nullsLast().op("uuid_ops"),
        ),
        index("questions_type_idx").using(
            "btree",
            table.type.asc().nullsLast().op("enum_ops"),
        ),
        foreignKey({
            columns: [table.sectionQuestionsId],
            foreignColumns: [sectionQuestions.id],
            name: "questions_sectionQuestionsId_sectionQuestions_id_fk",
        }),
        foreignKey({
            columns: [table.activitiesId],
            foreignColumns: [activities.id],
            name: "questions_activitiesId_activities_id_fk",
        }),
    ],
);

export const quizEvidence = pgTable(
    "quiz_evidence",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        studentActivityId: uuid("student_activity_id").notNull(),
        description: text(),
        evidenceCaptureType: evidenceCaptureType(
            "evidence_capture_type",
        ).notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("quiz_evidence_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("quiz_evidence_evidence_capture_type_idx").using(
            "btree",
            table.evidenceCaptureType.asc().nullsLast().op("enum_ops"),
        ),
        index("quiz_evidence_student_activity_id_idx").using(
            "btree",
            table.studentActivityId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.studentActivityId],
            foreignColumns: [studentActivity.id],
            name: "quiz_evidence_student_activity_id_student_activity_id_fk",
        }),
    ],
);

export const schoolMariadDb = pgTable(
    "school_mariad_db",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        username: varchar().notNull(),
        password: varchar().notNull(),
        database: varchar().notNull(),
        host: text().notNull(),
        port: integer(),
        schoolId: uuid(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("school_mariad_db_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("school_mariad_db_school_id_idx").using(
            "btree",
            table.schoolId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.schoolId],
            foreignColumns: [schools.id],
            name: "school_mariad_db_schoolId_schools_id_fk",
        }),
    ],
);

export const departments = pgTable(
    "departments",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("departments_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("departments_name_idx").using(
            "btree",
            table.name.asc().nullsLast().op("text_ops"),
        ),
    ],
);

export const studentAnswers = pgTable(
    "student_answers",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        questionId: uuid().notNull(),
        studentActivityId: uuid().notNull(),
        answers: json(),
        points: integer().default(0),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("student_answers_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("student_answers_question_id_idx").using(
            "btree",
            table.questionId.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_answers_student_activity_id_idx").using(
            "btree",
            table.studentActivityId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.questionId],
            foreignColumns: [questions.id],
            name: "student_answers_questionId_questions_id_fk",
        }),
        foreignKey({
            columns: [table.studentActivityId],
            foreignColumns: [studentActivity.id],
            name: "student_answers_studentActivityId_student_activity_id_fk",
        }),
    ],
);

export const sectionQuestions = pgTable(
    "sectionQuestions",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        title: text().notNull(),
        description: text(),
        order: integer().default(0),
        shuffleQuestions: boolean().default(false),
        bank: boolean().default(false),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        activitiesId: uuid(),
    },
    (table) => [
        index("section_questions_activities_id_idx").using(
            "btree",
            table.activitiesId.asc().nullsLast().op("uuid_ops"),
        ),
        index("section_questions_bank_idx").using(
            "btree",
            table.bank.asc().nullsLast().op("bool_ops"),
        ),
        index("section_questions_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("section_questions_order_idx").using(
            "btree",
            table.order.asc().nullsLast().op("int4_ops"),
        ),
        foreignKey({
            columns: [table.activitiesId],
            foreignColumns: [activities.id],
            name: "sectionQuestions_activitiesId_activities_id_fk",
        }),
    ],
);

export const activityBadge = pgTable(
    "activity_badge",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        activityId: uuid("activity_id").notNull(),
        schoolBadgeId: uuid("school_badge_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        createdBy: uuid("created_by").notNull(),
    },
    (table) => [
        index("activity_badge_activity_id_idx").using(
            "btree",
            table.activityId.asc().nullsLast().op("uuid_ops"),
        ),
        index("activity_badge_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("activity_badge_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("activity_badge_school_badge_id_idx").using(
            "btree",
            table.schoolBadgeId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.activityId],
            foreignColumns: [activities.id],
            name: "activity_badge_activity_id_activities_id_fk",
        }),
        foreignKey({
            columns: [table.schoolBadgeId],
            foreignColumns: [schoolBadge.id],
            name: "activity_badge_school_badge_id_school_badge_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "activity_badge_created_by_users_id_fk",
        }),
    ],
);

export const notificationDevice = pgTable(
    "notification_device",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid().notNull(),
        deviceType: deviceType("device_type").notNull(),
        endpoint: text().notNull(),
        p256Dh: text().notNull(),
        auth: text().notNull(),
        deviceInfo: jsonb("device_info").default({}),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
    },
    (table) => [
        index("notification_device_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("notification_device_device_type_idx").using(
            "btree",
            table.deviceType.asc().nullsLast().op("enum_ops"),
        ),
        index("notification_device_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "notification_device_userId_users_id_fk",
        }),
        unique("notification_device_endpoint_unique").on(table.endpoint),
    ],
);

export const schoolBadge = pgTable(
    "school_badge",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        schoolId: uuid("school_id").notNull(),
        enable: boolean().default(true).notNull(),
        name: text().notNull(),
        description: text(),
        createdBy: uuid("created_by").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        classCardId: uuid("class_card_id"),
        shared: boolean().default(false).notNull(),
        limit: integer().default(9999),
        default: boolean().default(false).notNull(),
    },
    (table) => [
        index("school_badge_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("school_badge_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("school_badge_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("school_badge_default_idx").using(
            "btree",
            table.default.asc().nullsLast().op("bool_ops"),
        ),
        index("school_badge_enable_idx").using(
            "btree",
            table.enable.asc().nullsLast().op("bool_ops"),
        ),
        index("school_badge_school_id_idx").using(
            "btree",
            table.schoolId.asc().nullsLast().op("uuid_ops"),
        ),
        index("school_badge_shared_idx").using(
            "btree",
            table.shared.asc().nullsLast().op("bool_ops"),
        ),
        foreignKey({
            columns: [table.schoolId],
            foreignColumns: [schools.id],
            name: "school_badge_school_id_schools_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "school_badge_created_by_users_id_fk",
        }),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "school_badge_class_card_id_class_card_id_fk",
        }),
    ],
);

export const studentBadge = pgTable(
    "student_badge",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        activityId: uuid("activity_id"),
        userId: uuid("user_id").notNull(),
        schoolBadgeId: uuid("school_badge_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        createdBy: uuid("created_by").notNull(),
        classCardId: uuid("class_card_id"),
    },
    (table) => [
        index("student_badge_activity_id_idx").using(
            "btree",
            table.activityId.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_badge_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_badge_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("student_badge_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_badge_school_badge_id_idx").using(
            "btree",
            table.schoolBadgeId.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_badge_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.activityId],
            foreignColumns: [activities.id],
            name: "student_badge_activity_id_activities_id_fk",
        }),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "student_badge_user_id_users_id_fk",
        }),
        foreignKey({
            columns: [table.schoolBadgeId],
            foreignColumns: [schoolBadge.id],
            name: "student_badge_school_badge_id_school_badge_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "student_badge_created_by_users_id_fk",
        }),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "student_badge_class_card_id_class_card_id_fk",
        }),
    ],
);

export const notification = pgTable(
    "notification",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid().notNull(),
        title: text().notNull(),
        body: text().notNull(),
        image: text(),
        link: text(),
        isRead: boolean("is_read").default(false),
        type: notificationType().notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
    },
    (table) => [
        index("notification_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("notification_is_read_idx").using(
            "btree",
            table.isRead.asc().nullsLast().op("bool_ops"),
        ),
        index("notification_type_idx").using(
            "btree",
            table.type.asc().nullsLast().op("enum_ops"),
        ),
        index("notification_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "notification_userId_users_id_fk",
        }),
    ],
);

export const chatboxMembers = pgTable(
    "chatbox_members",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        chatboxId: uuid(),
        userId: uuid(),
        createdAt: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp({ withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        lastSeen: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        lastMessageId: uuid(),
    },
    (table) => [
        index("chatbox_members_chatbox_id_idx").using(
            "btree",
            table.chatboxId.asc().nullsLast().op("uuid_ops"),
        ),
        index("chatbox_members_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("chatbox_members_last_message_id_idx").using(
            "btree",
            table.lastMessageId.asc().nullsLast().op("uuid_ops"),
        ),
        index("chatbox_members_last_seen_idx").using(
            "btree",
            table.lastSeen.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("chatbox_members_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.chatboxId],
            foreignColumns: [chatbox.id],
            name: "chatbox_members_chatboxId_chatbox_id_fk",
        }),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "chatbox_members_userId_users_id_fk",
        }),
        foreignKey({
            columns: [table.lastMessageId],
            foreignColumns: [chatboxMessages.id],
            name: "chatbox_members_lastMessageId_chatbox_messages_id_fk",
        }),
    ],
);

export const post = pgTable(
    "post",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        classCardId: uuid().notNull(),
        message: text(),
        pinned: boolean().default(false),
        isScheduledPost: boolean().default(false),
        schedulePost: timestamp({ withTimezone: true, mode: "string" }),
        userPostType: userRoleType(),
        archive: boolean().default(false),
        createdAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        createdBy: uuid(),
        isRequestPosting: boolean().default(false),
    },
    (table) => [
        index("post_archive_idx").using(
            "btree",
            table.archive.asc().nullsLast().op("bool_ops"),
        ),
        index("post_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("post_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("post_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("post_is_request_posting_idx").using(
            "btree",
            table.isRequestPosting.asc().nullsLast().op("bool_ops"),
        ),
        index("post_is_scheduled_post_idx").using(
            "btree",
            table.isScheduledPost.asc().nullsLast().op("bool_ops"),
        ),
        index("post_pinned_idx").using(
            "btree",
            table.pinned.asc().nullsLast().op("bool_ops"),
        ),
        index("post_schedule_post_idx").using(
            "btree",
            table.schedulePost.asc().nullsLast().op("timestamptz_ops"),
        ),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "post_classCardId_class_card_id_fk",
        }),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "post_createdBy_users_id_fk",
        }),
    ],
);

export const participants = pgTable(
    "participants",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid().notNull(),
        classCardId: uuid().notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        enabled: boolean().default(true).notNull(),
        hasPermit: boolean("has_permit").default(true).notNull(),
    },
    (table) => [
        index("participants_class_card_id_idx").using(
            "btree",
            table.classCardId.asc().nullsLast().op("uuid_ops"),
        ),
        index("participants_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("participants_enabled_idx").using(
            "btree",
            table.enabled.asc().nullsLast().op("bool_ops"),
        ),
        index("participants_has_permit_idx").using(
            "btree",
            table.hasPermit.asc().nullsLast().op("bool_ops"),
        ),
        index("participants_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "participants_userId_users_id_fk",
        }),
        foreignKey({
            columns: [table.classCardId],
            foreignColumns: [classCard.id],
            name: "participants_classCardId_class_card_id_fk",
        }),
    ],
);

export const studentActivity = pgTable(
    "student_activity",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        activityId: uuid().notNull(),
        userId: uuid().notNull(),
        score: integer().default(0),
        submitted: boolean().default(false),
        countSubmitted: integer().default(1),
        submitDate: timestamp({ mode: "string" }).defaultNow(),
        graded: boolean().default(false),
        createdAt: timestamp({ mode: "string" }).defaultNow(),
        updatedAt: timestamp({ mode: "string" }).defaultNow(),
        gradedBy: uuid(),
        available: boolean().default(true),
        gradedDate: timestamp({ mode: "string" }).defaultNow(),
        startedDate: timestamp({ mode: "string" }).defaultNow(),
        feedback: json().default(null),
        teacherFeedback: json().default(null),
    },
    (table) => [
        index("student_activity_activity_id_idx").using(
            "btree",
            table.activityId.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_activity_available_idx").using(
            "btree",
            table.available.asc().nullsLast().op("bool_ops"),
        ),
        index("student_activity_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamp_ops"),
        ),
        index("student_activity_graded_by_idx").using(
            "btree",
            table.gradedBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("student_activity_graded_idx").using(
            "btree",
            table.graded.asc().nullsLast().op("bool_ops"),
        ),
        index("student_activity_submit_date_idx").using(
            "btree",
            table.submitDate.asc().nullsLast().op("timestamp_ops"),
        ),
        index("student_activity_submitted_idx").using(
            "btree",
            table.submitted.asc().nullsLast().op("bool_ops"),
        ),
        index("student_activity_user_id_idx").using(
            "btree",
            table.userId.asc().nullsLast().op("uuid_ops"),
        ),
        foreignKey({
            columns: [table.activityId],
            foreignColumns: [activities.id],
            name: "student_activity_activityId_activities_id_fk",
        }),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "student_activity_userId_users_id_fk",
        }),
        foreignKey({
            columns: [table.gradedBy],
            foreignColumns: [users.id],
            name: "student_activity_gradedBy_users_id_fk",
        }),
    ],
);

export const dataMigration = pgTable(
    "data_migration",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        schoolId: uuid("school_id").notNull(),
        dataId: text("data_id"),
        data: jsonb(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("data_migration_data_id_idx").using(
            "btree",
            table.dataId.asc().nullsLast().op("text_ops"),
        ),
        index("data_migration_school_id_idx").using(
            "btree",
            table.schoolId.asc().nullsLast().op("uuid_ops"),
        ),
    ],
);

export const prompt = pgTable(
    "prompt",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        featType: text("feat_type").notNull(),
        userPrompt: text("user_prompt").notNull(),
        promptTitle: text("prompt_title"),
        result: text(),
        aiModelName: text("ai_model_name"),
        createdAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        updatedAt: timestamp({
            withTimezone: true,
            mode: "string",
        }).defaultNow(),
        completedAt: timestamp({ withTimezone: true, mode: "string" }),
        tokenAiValue: integer("token_ai_value"),
        creditsSpent: integer("credits_spent"),
        status: text().notNull(),
        createdBy: uuid().notNull(),
        bypassedProcess: boolean("bypassed_process").default(false).notNull(),
    },
    (table) => [
        index("prompt_completed_at_idx").using(
            "btree",
            table.completedAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("prompt_created_at_idx").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
        index("prompt_created_by_idx").using(
            "btree",
            table.createdBy.asc().nullsLast().op("uuid_ops"),
        ),
        index("prompt_feat_type_idx").using(
            "btree",
            table.featType.asc().nullsLast().op("text_ops"),
        ),
        index("prompt_status_idx").using(
            "btree",
            table.status.asc().nullsLast().op("text_ops"),
        ),
        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "prompt_createdBy_users_id_fk",
        }),
    ],
);

export const aiModels = pgTable("ai_models", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
        .defaultNow()
        .notNull(),
    status: text().default("active").notNull(),
});
