import client from './client';

export interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
}

export interface CalendarEventListResponse {
  data: CalendarEvent[];
}

export const calendarApi = {
  getEvents: async (params: { from: string; to: string }) => {
    const response = await client.get<CalendarEventListResponse>('/calendar/events', { params });
    return response.data;
  },

  createEvent: async (payload: {
    title: string;
    startAt: string;
    endAt: string;
    allDay: boolean;
  }) => {
    const response = await client.post('/calendar/events', payload);
    return response.data;
  },
};
