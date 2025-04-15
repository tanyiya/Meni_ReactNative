import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Clock, X, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import useStatusStore from '@/store/useStatusStore';

export const StatusWidget = () => {
  const { myStatus, partnerStatus, busySince, busyActivity, setMyStatus } = useStatusStore();
  const [elapsedTime, setElapsedTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [activity, setActivity] = useState('');

  useEffect(() => {
    if (partnerStatus === 'busy' && busySince) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - busySince;
        
        const minutes = Math.floor(elapsed / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        setElapsedTime(
          hours > 0 
            ? `${hours}h ${remainingMinutes}m` 
            : `${remainingMinutes}m`
        );
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    } else {
      setElapsedTime('');
    }
  }, [partnerStatus, busySince]);

  const toggleStatus = () => {
    if (myStatus === 'free') {
      setModalVisible(true);
    } else {
      setMyStatus('free');
    }
  };

  const confirmBusyStatus = () => {
    setMyStatus('busy', activity);
    setModalVisible(false);
    setActivity('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.partnerStatus}>
        <Text style={styles.title}>Partner's Status</Text>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: partnerStatus === 'busy' ? colors.busy : colors.free }
        ]}>
          <Text style={styles.statusText}>
            {partnerStatus === 'busy' ? 'Busy' : 'Free'}
          </Text>
        </View>
        
        {partnerStatus === 'busy' && (
          <View style={styles.busyInfo}>
            {busyActivity ? (
              <Text style={styles.activityText}>{busyActivity}</Text>
            ) : null}
            <View style={styles.timeRow}>
              <Clock size={16} color={colors.textLight} />
              <Text style={styles.timeText}>{elapsedTime || 'Just now'}</Text>
            </View>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.myStatusButton, 
          { backgroundColor: myStatus === 'busy' ? colors.busy : colors.free }
        ]}
        onPress={toggleStatus}
      >
        <Text style={styles.myStatusText}>
          I am {myStatus === 'busy' ? 'Busy' : 'Free'}
        </Text>
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
              <Text style={styles.modalTitle}>What are you doing?</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="E.g., Working, Studying, Cooking..."
              value={activity}
              onChangeText={setActivity}
              autoFocus
            />
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={confirmBusyStatus}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.confirmText}>Set as Busy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  partnerStatus: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statusIndicator: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  busyInfo: {
    marginTop: 4,
  },
  activityText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  myStatusButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  myStatusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
    padding: 20,
    width: '85%',
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});