import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { CalendarView } from '@/components/CalendarView';
import { colors } from '@/constants/colors';

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Calendar' }} />
      <CalendarView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});