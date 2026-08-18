import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { bookingsAPI, courtsAPI } from '../services/api';

interface Court {
  id: number;
  name: string;
  location: string;
  price_per_hour: number;
  rating: number;
  image_url: string;
}

interface Booking {
  id: number;
  court_id: number;
  court_name: string;
  location: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addHour(time: string): string {
  const hour = parseInt(time.split(':')[0], 10) + 1;
  return `${String(hour).padStart(2, '0')}:00`;
}

export default function Booking() {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const IS_SMALL = SCREEN_H < 680;
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courtsRes, bookingsRes] = await Promise.all([
        courtsAPI.getAll(),
        bookingsAPI.getAll(),
      ]);
      setCourts(courtsRes.data);
      setBookings(bookingsRes.data);
      setSelectedCourt((prev) => prev ?? courtsRes.data[0] ?? null);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const isSlotAvailable = (slot: string): boolean => {
    if (!selectedCourt) return false;
    const dateKey = formatDateKey(selectedDate);
    return !bookings.some(
      (b) =>
        b.court_id === selectedCourt.id &&
        b.booking_date === dateKey &&
        b.status !== 'cancelled' &&
        slot >= b.start_time &&
        slot < b.end_time
    );
  };

  const handleBook = async () => {
    if (!selectedCourt || !selectedTime) return;
    setSubmitting(true);
    try {
      await bookingsAPI.create({
        court_id: selectedCourt.id,
        booking_date: formatDateKey(selectedDate),
        start_time: selectedTime,
        end_time: addHour(selectedTime),
        total_price: selectedCourt.price_per_hour,
      });
      Alert.alert('Success', 'Court booked successfully!');
      setSelectedTime(null);
      await loadData();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await bookingsAPI.cancel(id);
      Alert.alert('Success', 'Booking cancelled successfully');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  const canBook = !!selectedCourt && !!selectedTime && !submitting;
  const pad = Math.max(SCREEN_W * 0.06, 16);
  const dayChipWidth = Math.max((SCREEN_W - pad * 2 - 10 * 6) / 7, 36);
  const slotWidth = `${(100 - 6 * 2) / 3}%`;

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingHorizontal: pad,
            paddingBottom: IS_SMALL ? 28 : 32,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Ionicons name="calendar" size={IS_SMALL ? 26 : 32} color="white" />
          <Text style={[styles.headerTitle, { fontSize: IS_SMALL ? 20 : 24, marginLeft: 12 }]}>
            Booking
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { fontSize: IS_SMALL ? 12 : 14 }]}>
          Reserve your court now
        </Text>
      </View>

      <View style={[styles.section, { padding: pad }]}>
        <Text style={[styles.sectionTitle, { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 8 : 12 }]}>
          Select Court
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 24 }}
          >
            {courts.map((court) => {
              const active = selectedCourt?.id === court.id;
              return (
                <TouchableOpacity
                  key={court.id}
                  onPress={() => {
                    setSelectedCourt(court);
                    setSelectedTime(null);
                  }}
                  style={[styles.courtChip, active && styles.courtChipActive]}
                >
                  <Text
                    style={[
                      styles.courtChipName,
                      active && styles.courtChipTextActive,
                      { fontSize: IS_SMALL ? 12 : 14 },
                    ]}
                    numberOfLines={1}
                  >
                    {court.name}
                  </Text>
                  <Text
                    style={[
                      styles.courtChipPrice,
                      active && styles.courtChipTextActive,
                      { fontSize: IS_SMALL ? 10 : 12 },
                    ]}
                  >
                    ${court.price_per_hour}/hr
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={[styles.section, { padding: pad }]}>
        <Text style={[styles.sectionTitle, { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 8 : 12 }]}>
          Select Date
        </Text>
        <View style={styles.daysRow}>
          {days.map((day) => {
            const key = formatDateKey(day);
            const active = formatDateKey(selectedDate) === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedDate(day);
                  setSelectedTime(null);
                }}
                style={[
                  styles.dayChip,
                  {
                    width: dayChipWidth,
                    paddingVertical: IS_SMALL ? 8 : 10,
                    borderRadius: 10,
                  },
                  active && styles.dayChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayWeekday,
                    { fontSize: IS_SMALL ? 10 : 12, marginBottom: IS_SMALL ? 2 : 4 },
                    active && styles.dayTextActive,
                  ]}
                >
                  {WEEKDAYS[day.getDay()]}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    { fontSize: IS_SMALL ? 14 : 16 },
                    active && styles.dayTextActive,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.section, { padding: pad }]}>
        <Text style={[styles.sectionTitle, { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 8 : 12 }]}>
          Available Time Slots
        </Text>
        <View style={[styles.timeSlotsGrid, { gap: IS_SMALL ? 8 : 12, marginBottom: IS_SMALL ? 14 : 20 }]}>
          {TIME_SLOTS.map((slot) => {
            const available = isSlotAvailable(slot);
            const active = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                disabled={!available}
                onPress={() => setSelectedTime(slot)}
                style={[
                  styles.timeSlot,
                  {
                    width: slotWidth,
                    padding: IS_SMALL ? 8 : 12,
                    borderRadius: 8,
                  },
                  !available && styles.timeSlotDisabled,
                  active && styles.timeSlotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    { fontSize: IS_SMALL ? 12 : 14 },
                    !available && styles.timeSlotTextDisabled,
                    active && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          disabled={!canBook}
          onPress={handleBook}
          style={[
            styles.bookButton,
            { padding: IS_SMALL ? 12 : 16, borderRadius: 12 },
            !canBook && styles.bookButtonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={[
                styles.bookButtonText,
                { fontSize: IS_SMALL ? 14 : 16 },
              ]}
            >
              {selectedCourt && selectedTime
                ? `Book ${selectedCourt.name} - $${selectedCourt.price_per_hour}`
                : 'Select court, date and time'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { padding: pad, paddingBottom: IS_SMALL ? 24 : 32 }]}>
        <Text style={[styles.sectionTitle, { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 8 : 12 }]}>
          Your Bookings
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={[styles.bookingCard, { padding: IS_SMALL ? 12 : 16 }]}>
              <View style={styles.bookingHeader}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.bookingCourt,
                      { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 6 : 8 },
                    ]}
                  >
                    {booking.court_name}
                  </Text>
                  <View style={[styles.bookingDetail, { marginBottom: IS_SMALL ? 2 : 4 }]}>
                    <Ionicons name="calendar-outline" size={14} color={colors.gray[500]} />
                    <Text style={[styles.bookingDetailText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      {booking.booking_date}
                    </Text>
                  </View>
                  <View style={[styles.bookingDetail, { marginBottom: IS_SMALL ? 2 : 4 }]}>
                    <Ionicons name="time-outline" size={14} color={colors.gray[500]} />
                    <Text style={[styles.bookingDetailText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      {booking.start_time} - {booking.end_time}
                    </Text>
                  </View>
                  <View style={[styles.bookingDetail, { marginBottom: IS_SMALL ? 2 : 4 }]}>
                    <Ionicons name="location-outline" size={14} color={colors.gray[500]} />
                    <Text style={[styles.bookingDetailText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      {booking.location}
                    </Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="pricetag-outline" size={14} color={colors.gray[500]} />
                    <Text style={[styles.bookingDetailText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      ${booking.total_price}
                    </Text>
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
                  style={[styles.cancelButton, { padding: IS_SMALL ? 10 : 12, borderRadius: 8 }]}
                  onPress={() => cancelBooking(booking.id)}
                >
                  <Text style={[styles.cancelButtonText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                    Cancel Booking
                  </Text>
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
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {},
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  loader: {
    marginVertical: 16,
  },
  courtChip: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    maxWidth: 180,
  },
  courtChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courtChipName: {
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 4,
  },
  courtChipPrice: {
    color: colors.primary,
  },
  courtChipTextActive: {
    color: 'white',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  dayChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dayWeekday: {
    color: colors.gray[500],
  },
  dayNumber: {
    fontWeight: '600',
    color: colors.gray[800],
  },
  dayTextActive: {
    color: 'white',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    backgroundColor: 'white',
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
    color: colors.gray[700],
  },
  timeSlotTextDisabled: {
    color: colors.gray[400],
  },
  timeSlotTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    paddingVertical: 32,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
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
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingDetailText: {
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
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
