import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { Calendar as CalendarIcon, Plus, X, Edit2, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import useCalendarStore from '@/store/useCalendarStore';
import { CalendarEvent, EventType } from '@/types';

const EventTypeLabels: Record<EventType, string> = {
  period: 'Period',
  anniversary: 'Anniversary',
  birthday: 'Birthday',
  custom: 'Custom',
};

const EventTypeColors: Record<EventType, string> = {
  period: colors.secondary,
  anniversary: colors.primary,
  birthday: colors.primaryLight,
  custom: colors.textLight,
};

export const CalendarView = () => {
  const { events, addEvent, updateEvent, removeEvent } = useCalendarStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<EventType>('custom');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setTitle('');
    setDate('');
    setType('custom');
    setNotes('');
    setEditingEvent(null);
  };

  const openAddModal = () => {
    resetForm();
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    setModalVisible(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date.split('T')[0]);
    setType(event.type);
    setNotes(event.notes || '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim() || !date) {
      Alert.alert('Error', 'Title and date are required');
      return;
    }

    const eventData = {
      title: title.trim(),
      date: new Date(date).toISOString(),
      type,
      notes: notes.trim() || undefined,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = () => {
    if (editingEvent) {
      Alert.alert(
        'Delete Event',
        'Are you sure you want to delete this event?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            onPress: () => {
              removeEvent(editingEvent.id);
              setModalVisible(false);
              resetForm();
            },
            style: 'destructive'
          }
        ]
      );
    }
  };

  // Group events by month
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  sortedEvents.forEach(event => {
    const date = new Date(event.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    
    groupedEvents[monthYear].push(event);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <View key={monthYear} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{monthYear}</Text>
              {monthEvents.map(event => (
                <TouchableOpacity 
                  key={event.id} 
                  style={styles.eventItem}
                  onPress={() => openEditModal(event)}
                >
                  <View style={[styles.eventTypeIndicator, { backgroundColor: EventTypeColors[event.type] }]} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                      <Text style={styles.eventType}>{EventTypeLabels[event.type]}</Text>
                    </View>
                    {event.notes ? (
                      <Text style={styles.eventNotes} numberOfLines={2}>{event.notes}</Text>
                    ) : null}
                  </View>
                  <Edit2 size={18} color={colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <CalendarIcon size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No events added yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first event</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={openAddModal}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Event title"
                value={title}
                onChangeText={setTitle}
              />
              
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                keyboardType="numbers-and-punctuation"
              />
              
              <Text style={styles.inputLabel}>Event Type</Text>
              <View style={styles.typeContainer}>
                {Object.entries(EventTypeLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.typeButton,
                      type === key && { backgroundColor: EventTypeColors[key as EventType], borderColor: EventTypeColors[key as EventType] }
                    ]}
                    onPress={() => setType(key as EventType)}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === key && { color: '#fff' }
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add notes about this event"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              {editingEvent && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Trash2 size={20} color={colors.danger} />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {editingEvent ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  eventTypeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  eventType: {
    fontSize: 14,
    color: colors.textLight,
  },
  eventNotes: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  formContainer: {
    padding: 16,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteButton: {
    padding: 8,
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});