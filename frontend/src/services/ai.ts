import api from "./api";

export interface AIChatRequest {
  message: string;
  event_id?: number;
  session_id?: string;
}

export interface AIChatResponse {
  session_id: string;
  reply: string;
  suggestions: string[];
  confidence: number;
}

export const aiService = {
  async chat(payload: AIChatRequest) {
    const response = await api.post<AIChatResponse>("/ai/chat/", payload);
    return response.data;
  },
};
