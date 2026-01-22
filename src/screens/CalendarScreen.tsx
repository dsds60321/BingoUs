import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CaretLeft, CaretRight } from '../components/Icons';
import { calendarApi, CalendarEvent } from '../api/calendar';

const CalendarScreen = () => {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const response = await calendarApi.getEvents({
        from: firstDay.toISOString().split('T')[0],
        to: lastDay.toISOString().split('T')[0],
      });

      if (!response || !response.data || !response.data.map) {
        setEvents([]);
        return;
      }

      const mappedEvents = response.data.map((e: CalendarEvent) => ({
        id: e.id,
        title: e.title,
        time: e.allDay ? 'All Day' : new Date(e.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(e.startAt),
        allDay: e.allDay
      }));
      
      setEvents(mappedEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ...

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const selectedDateEvents = events.filter(event => {
    const eventDate = event.date;
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <ArrowLeft size={24} color="#181410" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month Selector */}
        <View style={styles.monthSelectorContainer}>
           <View style={styles.calendarWrapper}>
            <View style={styles.monthControls}>
              <TouchableOpacity style={styles.caretButton} onPress={handlePrevMonth}>
                <CaretLeft size={18} color="#181410" />
              </TouchableOpacity>
              <Text style={styles.monthText}>{`${monthNames[month]} ${year}`}</Text>
              <TouchableOpacity style={styles.caretButton} onPress={handleNextMonth}>
                <CaretRight size={18} color="#181410" />
              </TouchableOpacity>
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {weekDays.map((d, i) => (
                <Text key={i} style={styles.weekDayText}>{d}</Text>
              ))}
              
              {/* Empty slots for padding first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCell} />
              ))}

              {days.map((day) => {
                const isSelected = 
                  day === selectedDate.getDate() && 
                  month === selectedDate.getMonth() && 
                  year === selectedDate.getFullYear();
                  
                return (
                  <TouchableOpacity
                    key={day}
                    style={styles.dayCell}
                    onPress={() => handleDateSelect(day)}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && styles.selectedDayCircle,
                        !isSelected && isToday(day) && styles.todayCircle,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {selectedDate.toDateString() === today.toDateString() ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Text>

        {loading ? (
           <ActivityIndicator size="small" color="#181410" style={{ marginTop: 20 }} />
        ) : selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event, index) => (
            <View key={index} style={styles.eventItem}>
              <View style={styles.eventTextContainer}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyEventContainer}>
             <Text style={styles.emptyEventText}>일정이 없습니다.</Text>
             <Text style={styles.emptyEventSubText}>새로운 일정을 추가해보세요!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPlaceholder: {
    width: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181410',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  monthSelectorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  calendarWrapper: {
    width: '100%',
    maxWidth: 336,
  },
  monthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    marginBottom: 8,
  },
  caretButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181410',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekDayText: {
    width: '14.28%', // 100/7
    height: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#181410',
    lineHeight: 48, // approximate vertical center
  },
  dayCell: {
    width: '14.28%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 36, // size-full in HTML but button is h-12 (48px). Circle likely smaller? HTML says "size-full rounded-full". 
    // Wait, button is h-12 w-full. div inside is size-full. So 48x48.
    height: 36, 
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayCircle: {
    backgroundColor: '#ffb56b',
  },
  todayCircle: {
    borderWidth: 1,
    borderColor: '#ffb56b',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181410',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#181410',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12, // min-h-[72px] in HTML, so padding to reach that
    minHeight: 72,
    gap: 16,
  },
  eventTextContainer: {
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181410',
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8d755e',
    marginTop: 2,
  },
  emptyEventContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEventText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181410',
    marginBottom: 4,
  },
  emptyEventSubText: {
    fontSize: 14,
    color: '#8d755e',
  },
});

export default CalendarScreen;
