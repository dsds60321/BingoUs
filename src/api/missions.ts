import client from './client';

export interface Mission {
  id: string;
  title: string;
  description: string;
  deadline: string;
  reward: string;
  status: 'open' | 'completed' | 'skipped';
  myCompletionStatus: boolean;
}

export interface MissionListResponse {
  data: Mission[];
}

export const missionsApi = {
  getMissions: async (params?: { status?: 'open' | 'completed'; month?: string }) => {
    const response = await client.get<MissionListResponse>('/missions', { params });
    return response.data;
  },

  createMission: async (payload: {
    title: string;
    description: string;
    assignedDate: string;
    deadline?: string;
    reward?: string;
  }) => {
    const response = await client.post('/missions', payload);
    return response.data;
  },

  completeMission: async (missionId: string) => {
    const response = await client.post(`/missions/${missionId}/complete`);
    return response.data;
  },
};
