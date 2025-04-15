import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import useCalendarStore from '@/store/useCalendarStore';

export const CalendarWidget = () => {
  const { events } = useCalendarStore();
  
  // Find the next upcoming event
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextEvent = upcomingEvents[0];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <Calendar size={24} color={colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Calendar</Text>
          {nextEvent ? (
            <Text style={styles.subtitle}>
              Next: {nextEvent.title} ({formatDate(nextEvent.date)})
            </Text>
          ) : (
            <Text style={styles.subtitle}>No upcoming events</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
});