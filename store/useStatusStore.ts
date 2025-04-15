import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Status, StatusState } from '@/types';

const useStatusStore = create<StatusState>()(
  persist(
    (set) => ({
      myStatus: 'free',
      partnerStatus: 'free',
      busySince: null,
      busyActivity: '',
      
      setMyStatus: (status: Status, activity?: string) => {
        set((state) => ({
          myStatus: status,
          busySince: status === 'busy' ? Date.now() : null,
          busyActivity: status === 'busy' && activity ? activity : '',
        }));
      },
      
      setPartnerStatus: (status: Status, activity?: string) => {
        set((state) => ({
          partnerStatus: status,
          busySince: status === 'busy' ? Date.now() : null,
          busyActivity: status === 'busy' && activity ? activity : '',
        }));
      },
    }),
    {
      name: 'status-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStatusStore;