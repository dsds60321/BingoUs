import client from './client';

export interface CoupleCreateResponse {
  data: {
    coupleId: string;
    inviteCode: string;
  };
}

export const couplesApi = {
  create: async (payload: { name: string; anniversaryDate: string }) => {
    const response = await client.post<CoupleCreateResponse>('/couples', payload);
    return response.data;
  },

  join: async (payload: { inviteCode: string }) => {
    const response = await client.post('/couples/join', payload);
    return response.data;
  },
};
