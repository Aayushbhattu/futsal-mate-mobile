import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { teamsAPI } from '../services/api';

interface Team {
  id: number;
  name: string;
  current_members: number;
  max_members: number;
  location: string;
  next_game: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image_url: string;
}

export default function FindTeam() {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const IS_SMALL = SCREEN_H < 680;
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamsAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Error loading teams:', error);
      Alert.alert('Error', 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (teamId: number) => {
    try {
      await teamsAPI.join(teamId);
      Alert.alert('Success', 'Successfully joined team!');
      loadTeams();
    } catch (error) {
      Alert.alert('Error', 'Failed to join team');
    }
  };

  const getLevelColor = (level: string) => {
    const colorMap = {
      Beginner: { bg: '#d1fae5', text: '#065f46' },
      Intermediate: { bg: '#dbeafe', text: '#1e40af' },
      Advanced: { bg: '#e9d5ff', text: '#6b21a8' },
    };
    return colorMap[level as keyof typeof colorMap] || colorMap.Beginner;
  };

  const filters = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Near Me'];
  const pad = Math.max(SCREEN_W * 0.06, 16);

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
          <Ionicons name="people" size={IS_SMALL ? 26 : 32} color="white" />
          <Text style={[styles.headerTitle, { fontSize: IS_SMALL ? 20 : 24, marginLeft: 12 }]}>
            Find Team
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { fontSize: IS_SMALL ? 12 : 14 }]}>
          Join a team or create your own
        </Text>
      </View>

      <View style={{ padding: pad }}>
        <TouchableOpacity
          style={[
            styles.createTeamButton,
            {
              padding: IS_SMALL ? 12 : 16,
              borderRadius: 12,
            },
          ]}
        >
          <Ionicons name="person-add" size={IS_SMALL ? 18 : 20} color="white" />
          <Text style={[styles.createTeamText, { fontSize: IS_SMALL ? 14 : 16, marginLeft: 8 }]}>
            Create Your Team
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: pad, marginBottom: IS_SMALL ? 12 : 16 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterButton,
              {
                paddingHorizontal: IS_SMALL ? 12 : 16,
                paddingVertical: IS_SMALL ? 6 : 8,
                borderRadius: 20,
              },
              activeFilter === filter && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { fontSize: IS_SMALL ? 12 : 14 },
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.section, { padding: pad }]}>
        <Text
          style={[
            styles.sectionTitle,
            { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 12 : 16 },
          ]}
        >
          Available Teams
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          teams.map((team) => {
            const isFull = team.current_members >= team.max_members;
            const levelColor = getLevelColor(team.level);

            return (
              <View key={team.id} style={styles.teamCard}>
                <View style={[styles.teamImageContainer, { height: IS_SMALL ? 100 : 128 }]}>
                  <Image source={{ uri: team.image_url }} style={styles.teamImage} />
                  <View style={styles.imageOverlay} />
                  <View style={[styles.teamImageInfo, { bottom: 10, left: 10, right: 10 }]}>
                    <Text
                      style={[
                        styles.teamName,
                        { fontSize: IS_SMALL ? 16 : 18 },
                      ]}
                    >
                      {team.name}
                    </Text>
                    <View style={[styles.levelBadge, { backgroundColor: levelColor.bg }]}>
                      <Text style={[styles.levelText, { color: levelColor.text }]}>
                        {team.level}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.teamInfo, { padding: IS_SMALL ? 12 : 16 }]}>
                  <View style={styles.teamStats}>
                    <View style={styles.teamStat}>
                      <Ionicons name="people-outline" size={14} color="#a855f7" />
                      <Text style={[styles.teamStatText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                        {team.current_members}/{team.max_members} Players
                      </Text>
                    </View>
                    <View style={styles.teamStat}>
                      <Ionicons name="calendar-outline" size={14} color="#a855f7" />
                      <Text style={[styles.teamStatText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                        {team.next_game}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.teamStat}>
                    <Ionicons name="location-outline" size={14} color="#a855f7" />
                    <Text style={[styles.teamStatText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      {team.location}
                    </Text>
                  </View>

                  <TouchableOpacity
                    disabled={isFull}
                    onPress={() => joinTeam(team.id)}
                    style={[
                      styles.joinButton,
                      { padding: IS_SMALL ? 10 : 12, borderRadius: 8, marginTop: IS_SMALL ? 8 : 12 },
                      isFull && styles.joinButtonDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.joinButtonText,
                        { fontSize: IS_SMALL ? 12 : 14 },
                        isFull && styles.joinButtonTextDisabled,
                      ]}
                    >
                      {isFull ? 'Team Full' : 'Request to Join'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
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
    backgroundColor: '#a855f7',
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
  createTeamButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createTeamText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: '#a855f7',
  },
  filterText: {
    color: colors.gray[600],
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  section: {},
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  loader: {
    marginVertical: 32,
  },
  teamCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  teamImageContainer: {
    position: 'relative',
  },
  teamImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  teamImageInfo: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: 'white',
    fontWeight: 'bold',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  teamInfo: {},
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamStatText: {
    color: colors.gray[600],
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#a855f7',
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  joinButtonTextDisabled: {
    color: colors.gray[500],
  },
});
