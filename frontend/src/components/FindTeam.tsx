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
  View,
} from 'react-native';
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="people" size={32} color="white" />
          <Text style={styles.headerTitle}>Find Team</Text>
        </View>
        <Text style={styles.headerSubtitle}>Join a team or create your own</Text>
      </View>

      <View style={styles.createTeamContainer}>
        <TouchableOpacity style={styles.createTeamButton}>
          <Ionicons name="person-add" size={20} color="white" />
          <Text style={styles.createTeamText}>Create Your Team</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Teams</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          teams.map((team) => {
            const isFull = team.current_members >= team.max_members;
            const levelColor = getLevelColor(team.level);

            return (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamImageContainer}>
                  <Image source={{ uri: team.image_url }} style={styles.teamImage} />
                  <View style={styles.imageOverlay} />
                  <View style={styles.teamImageInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: levelColor.bg }]}>
                      <Text style={[styles.levelText, { color: levelColor.text }]}>
                        {team.level}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.teamInfo}>
                  <View style={styles.teamStats}>
                    <View style={styles.teamStat}>
                      <Ionicons name="people-outline" size={16} color="#a855f7" />
                      <Text style={styles.teamStatText}>
                        {team.current_members}/{team.max_members} Players
                      </Text>
                    </View>
                    <View style={styles.teamStat}>
                      <Ionicons name="calendar-outline" size={16} color="#a855f7" />
                      <Text style={styles.teamStatText}>{team.next_game}</Text>
                    </View>
                  </View>

                  <View style={styles.teamStat}>
                    <Ionicons name="location-outline" size={16} color="#a855f7" />
                    <Text style={styles.teamStatText}>{team.location}</Text>
                  </View>

                  <TouchableOpacity
                    disabled={isFull}
                    onPress={() => joinTeam(team.id)}
                    style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
                  >
                    <Text
                      style={[
                        styles.joinButtonText,
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
  createTeamContainer: {
    padding: 24,
  },
  createTeamButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createTeamText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterContent: {
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#a855f7',
  },
  filterText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
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
    height: 128,
  },
  teamImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  teamImageInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: 'white',
    fontSize: 18,
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
  teamInfo: {
    padding: 16,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamStatText: {
    fontSize: 14,
    color: colors.gray[600],
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#a855f7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButtonTextDisabled: {
    color: colors.gray[500],
  },
});