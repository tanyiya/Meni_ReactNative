import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEvent, CalendarState } from '@/types';

const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],
      
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          ...event,
        };
        
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      
      updateEvent: (id, updatedEvent) => {
        set((state) => ({
          events: state.events.map((event) => 
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        }));
      },
      
      removeEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },
    }),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCalendarStore;