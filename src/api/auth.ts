import client, { setAccessToken } from './client';

export interface User {
  id: string;
  displayName: string;
  status: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface MeResponse {
  data: {
    id: string;
    publicId: string;
    displayName: string;
    email: string;
    coupleId: string | null;
  };
}

export const authApi = {
  login: async (payload: {
    provider: 'local' | 'apple' | 'google' | 'kakao';
    email?: string;
    password?: string;
    provider_token?: string;
  }) => {
    const response = await client.post<AuthResponse>('/auth/login', payload);
    console.log(response);
    if (response.data.data.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data;
  },

  getMe: async () => {
    const response = await client.get<MeResponse>('/users/me');
    return response.data;
  },
};
