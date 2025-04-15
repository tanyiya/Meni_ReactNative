import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { Plus, X, Shuffle, ChefHat } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import useFoodStore from '@/store/useFoodStore';
import { FoodChoice } from '@/types';

export const FoodRandomizerWidget = () => {
  const { selectedFood, randomize } = useFoodStore();
  
  return (
    <TouchableOpacity 
      style={styles.widgetContainer}
      onPress={randomize}
    >
      <View style={styles.widgetContent}>
        <ChefHat size={24} color={colors.primary} />
        <View style={styles.widgetTextContainer}>
          <Text style={styles.widgetTitle}>Food Randomizer</Text>
          <Text style={styles.widgetSubtitle}>
            {selectedFood ? selectedFood.name : 'Tap to decide what to eat'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const FoodRandomizer = () => {
  const { choices, selectedFood, addChoice, removeChoice, randomize, clearSelected } = useFoodStore();
  const [newFood, setNewFood] = useState('');

  const handleAddFood = () => {
    if (newFood.trim()) {
      addChoice({ name: newFood.trim() });
      setNewFood('');
    }
  };

  const handleRemoveFood = (id: string) => {
    Alert.alert(
      "Remove Food",
      "Are you sure you want to remove this food option?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => removeChoice(id), style: "destructive" }
      ]
    );
  };

  const renderFoodItem = ({ item }: { item: FoodChoice }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveFood(item.id)}>
        <X size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedFood ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Your meal will be:</Text>
          <View style={styles.selectedFood}>
            <Text style={styles.selectedFoodText}>{selectedFood.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.tryAgainButton}
            onPress={randomize}
          >
            <Shuffle size={18} color="#fff" />
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearSelected}
          >
            <Text style={styles.clearText}>Clear Selection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add food option..."
              value={newFood}
              onChangeText={setNewFood}
              onSubmitEditing={handleAddFood}
              returnKeyType="done"
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddFood}
            >
              <Plus size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.listTitle}>Your Food Options</Text>
          
          {choices.length > 0 ? (
            <FlatList
              data={choices}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Add some food options to get started
              </Text>
            </View>
          )}
          
          {choices.length > 1 && (
            <TouchableOpacity 
              style={styles.randomizeButton}
              onPress={randomize}
            >
              <Shuffle size={20} color="#fff" />
              <Text style={styles.randomizeText}>Randomize</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  widgetContainer: {
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
  widgetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  widgetSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  list: {
    flex: 1,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    color: colors.text,
  },
  randomizeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  randomizeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  selectedFood: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedFoodText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tryAgainText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  clearButton: {
    paddingVertical: 12,
  },
  clearText: {
    color: colors.textLight,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});