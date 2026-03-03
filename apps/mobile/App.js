import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import './global.css';

const STORAGE_KEY = '@insta_dummy_posts';
const NUM_COLUMNS = 3;
const INITIAL_POST_COUNT = 12;

const windowWidth = Dimensions.get('window').width;
const cellSize = Math.floor(windowWidth / NUM_COLUMNS);

const StoryBubble = ({ label, isAdd }) => (
  <View className="items-center w-[70px]">
    <View
      className={`w-16 h-16 rounded-full p-0.5 border-2 mb-1 ${
        isAdd ? 'border-ig-divider' : 'border-brand-pink'
      }`}
    >
      <View className="flex-1 rounded-full bg-ig-bg items-center justify-center">
        {isAdd ? (
          <Text className="text-3xl text-brand-blue font-light">+</Text>
        ) : (
          <Text className="text-3xl">😊</Text>
        )}
      </View>
    </View>
    <Text className="text-xs text-ig-text text-center" numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const PostCell = ({ uri, onPress, size }) => (
  <TouchableOpacity
    style={{ width: size, height: size, padding: 1 }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {uri ? (
      <Image source={{ uri }} className="flex-1 bg-ig-bg" />
    ) : (
      <View className="flex-1 bg-ig-bg items-center justify-center border border-ig-divider">
        <Text className="text-3xl text-ig-divider">+</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function App() {
  const [posts, setPosts] = useState(() => Array(INITIAL_POST_COUNT).fill(null));

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

  const pickImage = useCallback(async (index) => {
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
  }, []);

  const renderPost = ({ item, index }) => (
    <PostCell uri={item} onPress={() => pickImage(index)} size={cellSize} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Top bar */}
      <View className="flex-row items-center justify-between px-4 py-2.5 border-b border-ig-divider bg-white">
        <TouchableOpacity className="p-1">
          <Text className="text-[22px]">···</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold tracking-wide">username</Text>
        <TouchableOpacity className="p-1">
          <Text className="text-[22px]">☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View className="flex-row items-center px-4 pt-4 pb-3">
          <View className="w-[88px] h-[88px] rounded-full p-0.5 border-2 border-brand-pink">
            <View className="flex-1 rounded-full bg-ig-bg items-center justify-center">
              <Text className="text-[40px]">😎</Text>
            </View>
          </View>
          <View className="flex-1 flex-row justify-around ml-3">
            <View className="items-center">
              <Text className="text-[17px] font-bold">
                {posts.filter(Boolean).length}
              </Text>
              <Text className="text-[13px] text-ig-text">Posts</Text>
            </View>
            <View className="items-center">
              <Text className="text-[17px] font-bold">842</Text>
              <Text className="text-[13px] text-ig-text">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-[17px] font-bold">310</Text>
              <Text className="text-[13px] text-ig-text">Following</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View className="px-4 pb-3">
          <Text className="font-bold text-sm mb-0.5">Your Name</Text>
          <Text className="text-sm text-ig-text leading-5">✨ Living the moment</Text>
          <Text className="text-sm text-ig-text leading-5">📍 Los Angeles</Text>
          <Text className="text-sm text-brand-dark leading-5">🔗 yourwebsite.com</Text>
        </View>

        {/* Action buttons */}
        <View className="flex-row px-4 pb-3.5 gap-1.5">
          <TouchableOpacity className="flex-1 bg-ig-surface rounded-lg py-[7px] items-center">
            <Text className="font-semibold text-sm">Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-ig-surface rounded-lg py-[7px] items-center">
            <Text className="font-semibold text-sm">Share profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-ig-surface rounded-lg py-[7px] px-3 items-center">
            <Text className="font-semibold text-sm">👤+</Text>
          </TouchableOpacity>
        </View>

        {/* Story highlights */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-t border-ig-divider"
        >
          <View className="flex-row px-3 py-3.5 gap-3.5">
            <StoryBubble label="New" isAdd />
            <StoryBubble label="Travel" />
            <StoryBubble label="Food" />
            <StoryBubble label="Friends" />
            <StoryBubble label="Fitness" />
            <StoryBubble label="Work" />
          </View>
        </ScrollView>

        {/* Grid tabs */}
        <View className="flex-row border-t border-b border-ig-divider">
          <View
            className="flex-1 items-center py-2.5"
            style={{ borderBottomWidth: 1, borderBottomColor: '#262626' }}
          >
            <Text className="text-[22px]">⊞</Text>
          </View>
          <View className="flex-1 items-center py-2.5">
            <Text className="text-[22px]">🎬</Text>
          </View>
          <View className="flex-1 items-center py-2.5">
            <Text className="text-[22px]">👤</Text>
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
      <View
        className={`flex-row border-t border-ig-divider bg-white${
          Platform.OS === 'ios' ? ' pb-5' : ''
        }`}
      >
        <TouchableOpacity className="flex-1 items-center py-2.5">
          <Text className="text-[26px]">🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2.5">
          <Text className="text-[26px]">🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2.5">
          <Text className="text-[26px]">➕</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2.5">
          <Text className="text-[26px]">🎬</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2.5">
          <Text className="text-[26px]">👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
