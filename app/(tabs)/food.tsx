import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { FoodRandomizer } from '@/components/FoodRandomizer';
import { colors } from '@/constants/colors';

export default function FoodScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Food Randomizer' }} />
      <FoodRandomizer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});