import client from './client';

export type PostCategory = 'photo' | 'diary' | 'reflection';

export interface Post {
  id: string;
  category: PostCategory;
  title?: string;
  content?: string;
  topic?: string | null;
  images?: Array<{ url: string; width: number; height: number }>;
  createdAt: string;
  eventDate?: string;
  author: {
    id: string;
    displayName: string;
  };
  receipts?: {
    partnerRead: boolean;
  };
}

export interface PostListResponse {
  data: {
    posts: Post[];
    nextCursor: string | null;
  };
}

export const communityApi = {
  getPosts: async (params?: { category?: PostCategory; cursor?: string; limit?: number }) => {
    const response = await client.get<PostListResponse>('/community/posts', { params });
    
    // Defensive check: Ensure we always return a valid PostListResponse structure
    const defaultResponse = { data: { posts: [], nextCursor: null } };
    
    if (!response.data || !response.data.data) {
      return defaultResponse;
    }

    return {
      data: {
        posts: response.data.data.posts || [],
        nextCursor: response.data.data.nextCursor || null,
      }
    };
  },

  createPost: async (payload: {
    category: PostCategory;
    title?: string;
    content?: string;
    eventDate?: string;
    topic?: string | null;
    assetIds?: number[];
  }) => {
    const response = await client.post('/community/posts', payload);
    return response.data || {};
  },

  markAsRead: async (postId: string) => {
    const response = await client.post(`/community/posts/${postId}/read`);
    return response.data || { success: true };
  },
};
