import client from './client';

export interface HomeData {
  data: {
    couple: {
      name: string;
      dDay: number;
      backgroundImageUrl: string;
    };
    dailyQuestion: {
      id: number;
      question: string;
      myAnswer: string | null;
      partnerAnswer: { answered: boolean } | null;
    };
    unreadNotifications: number;
  };
}

export interface DailyAnswerResponse {
  data: {
    question: string;
    answers: Array<{
      userId: string;
      answer: string;
      createdAt: string;
    }>;
  };
}

export const homeApi = {
  getHome: async () => {
    const response = await client.get<HomeData>('/home');
    return response.data;
  },

  answerDailyQuestion: async (questionId: number | string, payload: { answer: string }) => {
    const response = await client.post(`/daily-questions/${questionId}/answers`, payload);
    return response.data;
  },

  getDailyAnswerDetail: async (questionId: number | string) => {
    const response = await client.get<DailyAnswerResponse>(`/daily-questions/${questionId}/answers`);
    return response.data;
  },
};
