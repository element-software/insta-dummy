import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = '@insta_dummy_posts';
const NUM_COLUMNS = 3;
const INITIAL_POST_COUNT = 12;

const windowWidth = Dimensions.get('window').width;
const cellSize = Math.floor(windowWidth / NUM_COLUMNS);

// --- Icons (pure SVG-free, using Unicode / emoji) ---
const Icon = ({ name, size = 24, color = '#000' }) => {
  const icons = {
    home: '🏠',
    search: '🔍',
    add: '➕',
    reels: '🎬',
    profile: '👤',
    menu: '☰',
    settings: '⚙️',
    plus: '+',
    options: '···',
    notifications: '♡',
    messenger: '✈',
  };
  return (
    <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>
      {icons[name] || '?'}
    </Text>
  );
};

// --- Story bubble ---
const StoryBubble = ({ label, isAdd }) => (
  <View style={styles.storyContainer}>
    <View style={[styles.storyRing, isAdd && styles.storyRingAdd]}>
      <View style={styles.storyInner}>
        {isAdd ? (
          <Text style={styles.storyAddIcon}>+</Text>
        ) : (
          <Text style={styles.storyEmoji}>😊</Text>
        )}
      </View>
    </View>
    <Text style={styles.storyLabel} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

// --- Post cell ---
const PostCell = ({ uri, onPress }) => (
  <TouchableOpacity style={styles.cell} onPress={onPress} activeOpacity={0.8}>
    {uri ? (
      <Image source={{ uri }} style={styles.cellImage} />
    ) : (
      <View style={styles.cellEmpty}>
        <Text style={styles.cellEmptyIcon}>+</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function App() {
  const [posts, setPosts] = useState(() =>
    Array(INITIAL_POST_COUNT).fill(null)
  );

  // Load persisted posts
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        const saved = JSON.parse(value);
        setPosts((prev) => {
          const merged = [...prev];
          saved.forEach((uri, i) => {
            if (i < merged.length) merged[i] = uri;
          });
          return merged;
        });
      }
    });
  }, []);

  const pickImage = useCallback(
    async (index) => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPosts((prev) => {
          const updated = [...prev];
          updated[index] = uri;
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    },
    []
  );

  const renderPost = ({ item, index }) => (
    <PostCell uri={item} onPress={() => pickImage(index)} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Top navigation bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarIcon}>
          <Icon name="options" size={22} />
        </TouchableOpacity>
        <Text style={styles.username}>username</Text>
        <TouchableOpacity style={styles.topBarIcon}>
          <Icon name="menu" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>😎</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {posts.filter(Boolean).length}
              </Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>842</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>310</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bio}>
          <Text style={styles.bioName}>Your Name</Text>
          <Text style={styles.bioText}>✨ Living the moment</Text>
          <Text style={styles.bioText}>📍 Los Angeles</Text>
          <Text style={styles.bioLink}>🔗 yourwebsite.com</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnFollow}>
            <Text style={styles.btnFollowText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnShare}>
            <Text style={styles.btnShareText}>Share profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDiscover}>
            <Text style={styles.btnDiscoverText}>👤+</Text>
          </TouchableOpacity>
        </View>

        {/* Stories / Highlights */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesScroll}
          contentContainerStyle={styles.storiesContent}
        >
          <StoryBubble label="New" isAdd />
          <StoryBubble label="Travel" />
          <StoryBubble label="Food" />
          <StoryBubble label="Friends" />
          <StoryBubble label="Fitness" />
          <StoryBubble label="Work" />
        </ScrollView>

        {/* Divider tabs (Grid / Reels / Tagged) */}
        <View style={styles.tabsRow}>
          <View style={[styles.tabItem, styles.tabActive]}>
            <Text style={styles.tabIcon}>⊞</Text>
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.tabIcon}>🎬</Text>
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.tabIcon}>👤</Text>
          </View>
        </View>

        {/* Photo grid */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(_, i) => String(i)}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          getItemLayout={(_, index) => ({
            length: cellSize,
            offset: cellSize * Math.floor(index / NUM_COLUMNS),
            index,
          })}
        />
      </ScrollView>

      {/* Bottom tab bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <Icon name="home" size={26} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Icon name="search" size={26} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Icon name="add" size={26} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Icon name="reels" size={26} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Icon name="profile" size={26} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dbdbdb',
    backgroundColor: '#fff',
  },
  topBarIcon: {
    padding: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    borderWidth: 2,
    borderColor: '#e1306c',
  },
  avatar: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    color: '#262626',
  },

  // Bio
  bio: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bioName: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  bioText: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 20,
  },
  bioLink: {
    fontSize: 14,
    color: '#00376b',
    lineHeight: 20,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  btnFollow: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  btnFollowText: {
    fontWeight: '600',
    fontSize: 14,
  },
  btnShare: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  btnShareText: {
    fontWeight: '600',
    fontSize: 14,
  },
  btnDiscover: {
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  btnDiscoverText: {
    fontWeight: '600',
    fontSize: 14,
  },

  // Stories
  storiesScroll: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dbdbdb',
  },
  storiesContent: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 14,
  },
  storyContainer: {
    alignItems: 'center',
    width: 70,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    borderWidth: 2,
    borderColor: '#e1306c',
    marginBottom: 4,
  },
  storyRingAdd: {
    borderColor: '#dbdbdb',
  },
  storyInner: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAddIcon: {
    fontSize: 28,
    color: '#0095f6',
    fontWeight: '300',
  },
  storyEmoji: {
    fontSize: 28,
  },
  storyLabel: {
    fontSize: 12,
    color: '#262626',
    textAlign: 'center',
    maxWidth: 66,
  },

  // Grid tabs
  tabsRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dbdbdb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dbdbdb',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#262626',
  },
  tabIcon: {
    fontSize: 22,
  },

  // Post grid
  cell: {
    width: cellSize,
    height: cellSize,
    padding: 1,
  },
  cellImage: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  cellEmpty: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  cellEmptyIcon: {
    fontSize: 28,
    color: '#c0c0c0',
  },

  // Bottom tab bar
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dbdbdb',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
});
