import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
const DateTimePicker = (_props: any) => null;
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../constants/colors';
import { bookingsAPI } from '../services/api';

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    { time: '08:00 AM', available: true },
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '01:00 PM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '05:00 PM', available: false },
    { time: '06:00 PM', available: true },
    { time: '07:00 PM', available: true },
  ];

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await bookingsAPI.cancel(id);
      Alert.alert('Success', 'Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="calendar" size={32} color="white" />
          <Text style={styles.headerTitle}>Booking</Text>
        </View>
        <Text style={styles.headerSubtitle}>Reserve your court now</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>{selectedDate.toLocaleDateString()}</Text>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              disabled={!slot.available}
              onPress={() => setSelectedTime(slot.time)}
              style={[
                styles.timeSlot,
                !slot.available && styles.timeSlotDisabled,
                selectedTime === slot.time && styles.timeSlotSelected,
              ]}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  !slot.available && styles.timeSlotTextDisabled,
                  selectedTime === slot.time && styles.timeSlotTextSelected,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Bookings</Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View>
                  <Text style={styles.bookingCourt}>{booking.court_name}</Text>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="calendar-outline" size={16} color={colors.gray[500]} />
                    <Text style={styles.bookingDetailText}>{booking.booking_date}</Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="time-outline" size={16} color={colors.gray[500]} />
                    <Text style={styles.bookingDetailText}>{booking.booking_time}</Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="location-outline" size={16} color={colors.gray[500]} />
                    <Text style={styles.bookingDetailText}>{booking.location}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    booking.status === 'confirmed'
                      ? styles.statusConfirmed
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      booking.status === 'confirmed'
                        ? styles.statusTextConfirmed
                        : styles.statusTextPending,
                    ]}
                  >
                    {booking.status}
                  </Text>
                </View>
              </View>
              {booking.status !== 'cancelled' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelBooking(booking.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.gray[800],
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: 'white',
    width: '31%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeSlotDisabled: {
    backgroundColor: colors.gray[100],
  },
  timeSlotSelected: {
    backgroundColor: '#3b82f6',
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  timeSlotTextDisabled: {
    color: colors.gray[400],
  },
  timeSlotTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    paddingVertical: 32,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bookingCourt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingDetailText: {
    fontSize: 14,
    color: colors.gray[500],
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusConfirmed: {
    backgroundColor: '#d1fae5',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextConfirmed: {
    color: '#065f46',
  },
  statusTextPending: {
    color: '#92400e',
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});