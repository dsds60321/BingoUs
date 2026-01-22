import client from './client';

export interface ChatMessage {
  id: string;
  text?: string;
  senderId: string;
  createdAt: string;
  type: 'text' | 'image' | 'system';
}

export interface ChatRoomResponse {
  data: {
    roomId: string;
    messages: ChatMessage[];
  };
}

export const chatApi = {
  getMessages: async (params?: { cursor?: string }) => {
    const response = await client.get<ChatRoomResponse>('/chat/messages', { params });
    return response.data;
  },

  sendMessage: async (payload: {
    text?: string;
    clientMessageId: string;
    type: 'text' | 'image';
    assetId?: number;
  }) => {
    const response = await client.post('/chat/messages', payload);
    return response.data;
  },
};
