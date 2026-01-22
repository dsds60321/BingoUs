import client from './client';

export interface PresignResponse {
  data: {
    uploadUrl: string;
    publicUrl: string;
    assetId: number;
  };
}

export const assetsApi = {
  getPresignedUrl: async (payload: {
    filename: string;
    mimeType: string;
    usage: 'community' | 'profile' | 'chat';
  }) => {
    const response = await client.post<PresignResponse>('/assets/presign', payload);
    return response.data;
  },
};
