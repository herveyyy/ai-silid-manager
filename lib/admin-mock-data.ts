import type {
    Attachment,
    PromptLog,
    SchoolAdminMetrics,
    SchoolDTO,
} from "@/lib/types/admin-types";

export const mockSchools: SchoolDTO[] = [
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        name: "Void State University",
        schoolCode: "VSU-01",
        username: "vsu.admin",
        site: "https://campus.vsu.edu",
        createdAt: "2024-01-15T08:00:00.000Z",
        updatedAt: "2026-03-01T12:00:00.000Z",
        aiFeat: false,
        enrichmentFeat: false,
        unlimitedStorage: false,
        unlimitedToken: false,
        tokenLimit: 0,
        storageLimit: 0,
        defaultAiModelId: null,
        secret: null,
        apiKey: null,
        passwordCredentialSet: false,
    },
    {
        id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        name: "Northridge Science Academy",
        schoolCode: "NSA-22",
        username: "northridge.ops",
        site: "https://learn.northridge.edu",
        createdAt: "2024-03-02T08:00:00.000Z",
        updatedAt: "2026-02-14T09:30:00.000Z",
        aiFeat: false,
        enrichmentFeat: false,
        unlimitedStorage: false,
        unlimitedToken: false,
        tokenLimit: 0,
        storageLimit: 0,
        defaultAiModelId: null,
        secret: null,
        apiKey: null,
        passwordCredentialSet: false,
    },
    {
        id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
        name: "Metro Manila STEM Institute",
        schoolCode: "MMSI-7",
        username: null,
        site: "https://stem.metro.edu.ph",
        createdAt: "2024-06-20T12:00:00.000Z",
        updatedAt: "2026-01-10T16:00:00.000Z",
        aiFeat: false,
        enrichmentFeat: false,
        unlimitedStorage: false,
        unlimitedToken: false,
        tokenLimit: 0,
        storageLimit: 0,
        defaultAiModelId: null,
        secret: null,
        apiKey: null,
        passwordCredentialSet: false,
    },
    {
        id: "d4e5f6a7-b8c9-0123-def0-234567890123",
        name: "Coastal District High",
        schoolCode: "CDH-003",
        username: "coastal.admin",
        site: "https://cdh.school",
        createdAt: "2025-01-08T00:00:00.000Z",
        updatedAt: "2026-03-18T11:00:00.000Z",
        aiFeat: false,
        enrichmentFeat: false,
        unlimitedStorage: false,
        unlimitedToken: false,
        tokenLimit: 0,
        storageLimit: 0,
        defaultAiModelId: null,
        secret: null,
        apiKey: null,
        passwordCredentialSet: false,
    },
    {
        id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
        name: "Heritage College Preparatory",
        schoolCode: "HCP-99",
        username: "heritage.root",
        site: "https://heritage-prep.edu",
        createdAt: "2025-09-01T08:00:00.000Z",
        updatedAt: "2026-03-20T07:45:00.000Z",
        aiFeat: false,
        enrichmentFeat: false,
        unlimitedStorage: false,
        unlimitedToken: false,
        tokenLimit: 0,
        storageLimit: 0,
        defaultAiModelId: null,
        secret: null,
        apiKey: null,
        passwordCredentialSet: false,
    },
];



export function getSchoolById(id: string): SchoolDTO | undefined {
    return mockSchools.find((s) => s.id === id);
}

export function getDefaultSchoolMetrics(id: string): SchoolAdminMetrics {
    return (
        {
            storageUsedBytes: 0,
            tokensUsed: 0,
            quotaStorageBytes: 1024 * 1024 * 1024,
            quotaTokens: 100_000,
        }
    );
}

export const mockAttachments: Attachment[] = [
    {
        id: "b1000001-0000-4000-8000-000000000001",
        parentId: "class-card-uuid-1",
        filePath: "/storage/vsu/materials/syllabus.pdf",
        fileType: "application/pdf",
        parentType: "materials",
        isDeleted: 0,
        isUsed: 1,
        createdAt: "2026-02-10T10:00:00.000Z",
        updatedAt: "2026-02-10T10:00:00.000Z",
        createdBy: "u1",
        fileSize: "2457600",
        fileName: "syllabus.pdf",
    },
    {
        id: "b1000001-0000-4000-8000-000000000002",
        parentId: "post-uuid-2",
        filePath: "/storage/vsu/posts/announcement.png",
        fileType: "image/png",
        parentType: "post",
        isDeleted: 0,
        isUsed: 1,
        createdAt: "2026-02-12T14:30:00.000Z",
        updatedAt: "2026-02-12T14:30:00.000Z",
        createdBy: "u2",
        fileSize: "890120",
        fileName: "announcement.png",
    },
    {
        id: "b1000001-0000-4000-8000-000000000003",
        parentId: "quiz-uuid-3",
        filePath: "/storage/vsu/quiz-evidence/scan.jpg",
        fileType: "image/jpeg",
        parentType: "quiz-evidence",
        isDeleted: 0,
        isUsed: 1,
        createdAt: "2026-02-20T09:15:00.000Z",
        updatedAt: "2026-02-20T09:15:00.000Z",
        createdBy: "u3",
        fileSize: "3145728",
        fileName: "evidence_scan.jpg",
    },
    {
        id: "b1000001-0000-4000-8000-000000000004",
        parentId: "legacy-orphan",
        filePath: "/storage/vsu/tmp/orphan.dat",
        fileType: "application/octet-stream",
        parentType: "content",
        isDeleted: 1,
        isUsed: 0,
        createdAt: "2025-11-01T00:00:00.000Z",
        updatedAt: "2026-01-05T00:00:00.000Z",
        createdBy: null,
        fileSize: "524288",
        fileName: "orphan.dat",
    },
];

export const mockPromptLogs: PromptLog[] = [
    {
        id: "c2000001-0000-4000-8000-000000000001",
        featType: "quiz_generator",
        userPrompt: "Generate 5 multiple-choice questions on photosynthesis.",
        promptTitle: "Bio — Quiz draft",
        result: null,
        aiModelName: "gpt-4.1",
        createdAt: "2026-03-20T08:00:00.000Z",
        updatedAt: "2026-03-20T08:00:10.000Z",
        completedAt: "2026-03-20T08:00:12.000Z",
        tokenAiValue: 1840,
        creditsSpent: 2,
        costValue: null,
        status: "completed",
        createdBy: "u2",
    },
    {
        id: "c2000001-0000-4000-8000-000000000002",
        featType: "rubric_assist",
        userPrompt: "Create a grading rubric for a 500-word essay.",
        promptTitle: "Essay rubric",
        result: "…",
        aiModelName: "gpt-4.1-mini",
        createdAt: "2026-03-21T11:20:00.000Z",
        updatedAt: "2026-03-21T11:20:05.000Z",
        completedAt: null,
        tokenAiValue: 920,
        creditsSpent: 1,
        costValue: null,
        status: "running",
        createdBy: "u1",
    },
    {
        id: "c2000001-0000-4000-8000-000000000003",
        featType: "summary",
        userPrompt: "Summarize chapter 3 for parents.",
        promptTitle: null,
        result: null,
        aiModelName: "gpt-4.1",
        createdAt: "2026-03-18T16:00:00.000Z",
        updatedAt: "2026-03-18T16:00:02.000Z",
        completedAt: null,
        tokenAiValue: 0,
        creditsSpent: 0,
        costValue: null,
        status: "failed",
        createdBy: "u3",
    },
];

/** Sum attachment `fileSize` (numeric string in schema) as bytes. */
export function totalAttachmentBytes(rows: Attachment[]): number {
    return rows.reduce((acc, row) => acc + Number(row.fileSize || 0), 0);
}

export function formatBytes(n: number): string {
    const safeValue = Number(n);
    if (!Number.isFinite(safeValue) || safeValue <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let v = safeValue;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
