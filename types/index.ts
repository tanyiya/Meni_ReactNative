export type Status = 'free' | 'busy';

export interface StatusState {
  myStatus: Status;
  partnerStatus: Status;
  busySince: number | null;
  busyActivity: string;
  setMyStatus: (status: Status, activity?: string) => void;
  setPartnerStatus: (status: Status, activity?: string) => void;
}

export interface FoodChoice {
  id: string;
  name: string;
  category?: string;
}

export interface FoodState {
  choices: FoodChoice[];
  selectedFood: FoodChoice | null;
  addChoice: (choice: Omit<FoodChoice, 'id'>) => void;
  removeChoice: (id: string) => void;
  randomize: () => void;
  clearSelected: () => void;
}

export type EventType = 'period' | 'anniversary' | 'birthday' | 'custom';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  type: EventType;
  notes?: string;
  recurring?: boolean;
}

export interface CalendarState {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Omit<CalendarEvent, 'id'>>) => void;
  removeEvent: (id: string) => void;
}