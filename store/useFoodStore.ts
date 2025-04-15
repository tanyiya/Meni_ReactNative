import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodChoice, FoodState } from '@/types';

const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      choices: [],
      selectedFood: null,
      
      addChoice: (choice) => {
        const newChoice: FoodChoice = {
          id: Date.now().toString(),
          ...choice,
        };
        
        set((state) => ({
          choices: [...state.choices, newChoice],
        }));
      },
      
      removeChoice: (id) => {
        set((state) => ({
          choices: state.choices.filter((choice) => choice.id !== id),
        }));
      },
      
      randomize: () => {
        const { choices } = get();
        if (choices.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * choices.length);
        set({ selectedFood: choices[randomIndex] });
      },
      
      clearSelected: () => {
        set({ selectedFood: null });
      },
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useFoodStore;