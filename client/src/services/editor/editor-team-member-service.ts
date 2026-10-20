import { api } from "@/lib/axios";
import { MEMBERS_PER_PAGE, type MemberKind } from "@/constants/editor/editor-team-member-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    EditorMember,
    EditorMemberList,
    EditorMemberParams,
    EditorMemberPayload,
    EditorMemberSummary,
} from "@/types/editor/editor-team-member";

const BASE = "/admin/team-members";

function endpoint(kind: MemberKind): string {
    return `${BASE}/${kind}`;
}

function toFormData(payload: EditorMemberPayload): FormData {
    const body = new FormData();
    body.append("name", payload.name);
    body.append("position", payload.position);
    body.append("bio", payload.bio);
    body.append("order", String(payload.order));
    body.append("isActive", String(payload.isActive));
    if (payload.image) body.append("image", payload.image);
    else if (payload.removeImage) body.append("removeImage", "true");
    return body;
}

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

type MemberListBody = {
    data: EditorMember[] | { items: EditorMember[]; meta: AdminPageMeta; summary: EditorMemberSummary };
    meta?: AdminPageMeta;
    summary?: EditorMemberSummary;
};

export async function getEditorMembers(
    kind: MemberKind,
    { page, search, isActive }: EditorMemberParams,
): Promise<EditorMemberList> {
    const { data } = await api.get<MemberListBody>(endpoint(kind), {
        params: {
            page,
            limit: MEMBERS_PER_PAGE,
            search: search || undefined,
            isActive: isActive === "all" ? undefined : isActive,
        },
    });

    const body = data.data;
    const items = Array.isArray(body) ? body : body.items;
    const meta = Array.isArray(body) ? data.meta : body.meta;
    const summary = Array.isArray(body) ? data.summary : body.summary;

    return {
        items,
        meta: meta ?? { total: items.length, page, limit: MEMBERS_PER_PAGE, totalPages: 1 },
        summary: summary ?? { total: items.length, active: 0, inactive: 0 },
    };
}

export async function createEditorMember(kind: MemberKind, payload: EditorMemberPayload): Promise<EditorMember> {
    const { data } = await api.post<ApiResponse<EditorMember>>(endpoint(kind), toFormData(payload), MULTIPART);
    return data.data;
}

export async function updateEditorMember(
    kind: MemberKind,
    id: number,
    payload: EditorMemberPayload,
): Promise<EditorMember> {
    const { data } = await api.put<ApiResponse<EditorMember>>(`${endpoint(kind)}/${id}`, toFormData(payload), MULTIPART);
    return data.data;
}

export async function deleteEditorMember(kind: MemberKind, id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`${endpoint(kind)}/${id}`);
}