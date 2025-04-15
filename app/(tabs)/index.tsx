import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { StatusWidget } from '@/components/StatusWidget';
import { FoodRandomizerWidget } from '@/components/FoodRandomizer';
import { CalendarWidget } from '@/components/CalendarWidget';
import { colors } from '@/constants/colors';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Together</Text>
          <Text style={styles.subtitle}>Stay connected with your partner</Text>
        </View>
        
        <StatusWidget />
        
        <Text style={styles.sectionTitle}>Shortcuts</Text>
        
        <Link href="/food" asChild>
          <View style={styles.linkContainer}>
            <FoodRandomizerWidget />
          </View>
        </Link>
        
        <Link href="/calendar" asChild>
          <View style={styles.linkContainer}>
            <CalendarWidget />
          </View>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  linkContainer: {
    marginBottom: 8,
  },
});