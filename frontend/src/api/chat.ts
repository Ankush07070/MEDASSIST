import api from "./axios";

export interface ChatRequest {
    question: string;
    report_id?: string;
}

export interface ChatSource {
    report_id: string;
    chunk_index: number;
}

export interface ChatResponse {
    answer: string;
    sources: ChatSource[];
}

export interface ChatHistoryItem {
    id: string;
    question: string;
    answer: string;
    report_id: string | null;
    created_at: string;
}

export async function sendChatMessage(
    data: ChatRequest
): Promise<ChatResponse> {

    const response = await api.post<ChatResponse>(
        "/chat",
        data
    );

    return response.data;
}

export async function getChatHistory(): Promise<ChatHistoryItem[]> {

    const response = await api.get<ChatHistoryItem[]>(
        "/chat/history"
    );

    return response.data;
}