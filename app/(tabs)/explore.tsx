import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const reasons = [
  { emoji: '🌸', text: 'Tumhari smile dekh ke mera poora din ban jaata hai' },
  { emoji: '🌟', text: 'Tum jaisi koi nahi hai is duniya mein' },
  { emoji: '💫', text: 'Tumhari awaaz sunke sab tension bhool jaata hoon' },
  { emoji: '🌹', text: 'Tum meri sabse badi strength ho' },
  { emoji: '🦋', text: 'Tumhare saath har pal special lagta hai' },
  { emoji: '🌙', text: 'Raat ko bhi tumhari yaad aati hai' },
  { emoji: '☀️', text: 'Subah uthke sabse pehle tumhara khayal aata hai' },
  { emoji: '💎', text: 'Tum meri life ki sabse precious cheez ho' },
  { emoji: '🎵', text: 'Tumhari hansi mera favorite song hai' },
  { emoji: '🏠', text: 'Tum jahan ho wahi mera ghar hai' },
];

const memories = [
  {
    emoji: '💕',
    title: 'Pehli Baar',
    text: 'Jab Satyam ne pehli baar Tanya ko dekha tha, tabhi dil ne kaha tha ki yahi hai meri soulmate...',
  },
  {
    emoji: '🥰',
    title: 'Tanya ki Care',
    text: 'Jab Tanya Soni meri fikar karti hai na, tab Satyam ko lagta hai ki usse zyada lucky koi nahi hai.',
  },
  {
    emoji: '😍',
    title: 'Woh Cute Smile',
    text: 'Tanya ki woh smile... Satyam us smile ke liye kuch bhi kar sakta hai.',
  },
  {
    emoji: '🤗',
    title: 'Satyam + Tanya',
    text: 'Hamari baatein, hamari yaadein, aur hamara saath — yeh sab Satyam ke liye sabse upar hai.',
  },
];

const ReasonCard = ({ item, index }: { item: typeof reasons[0]; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.reasonCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <Text style={styles.reasonEmoji}>{item.emoji}</Text>
      <Text style={styles.reasonText}>{item.text}</Text>
    </Animated.View>
  );
};

export default function ExploreScreen() {
  const [showReasons, setShowReasons] = useState(false);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a1e', '#1e0f2b', '#2d1133', '#1a0a1e']}
        style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}>
            <Text style={styles.headerEmoji}>💌</Text>
            <Text style={styles.headerTitle}>For Tanya Soni</Text>
            <Text style={styles.headerSubtitle}>
              Satyam ki taraf se ek chhota sa gift... ❤️
            </Text>
          </Animated.View>

          {/* Love Letter */}
          <Animated.View style={[styles.letterCard, { opacity: headerFade }]}>
            <View style={styles.letterHeader}>
              <Text style={styles.letterEmoji}>📝</Text>
              <Text style={styles.letterTitle}>Mera Dil Ki Baat</Text>
            </View>
            <View style={styles.letterDivider} />
            <Text style={styles.letterText}>
              Dear Tanya,{'\n\n'}
              Main jaanta hoon ki maine bohot galtiyan ki hain. Satyam ko
              pta hai ki usne Tanya Soni ka dil dukhaya hai, aur mujhe 
              uska bohot dukh hai.{'\n\n'}
              Tum meri zindagi ki sabse khoobsurat insaan ho. Satyam + Tanya
              ki jodi hamesha salamat rahe, bas yahi dua hai.{'\n\n'}
              Main apni saari galtiyan accept karta hoon aur promise 
              karta hoon ki ab se Satyam better banega — sirf apni 
              Tanya ke liye.{'\n\n'}
              I love you so much Tanya Soni. 💕{'\n\n'}
              — Tumhara Satyam ❤️
            </Text>
          </Animated.View>

          {/* Memories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💭</Text>
            <Text style={styles.sectionTitle}>Pyaari Yaadein</Text>
          </View>

          {memories.map((memory, index) => (
            <Animated.View
              key={index}
              style={[styles.memoryCard, { opacity: headerFade }]}>
              <View style={styles.memoryHeader}>
                <Text style={styles.memoryEmoji}>{memory.emoji}</Text>
                <Text style={styles.memoryTitle}>{memory.title}</Text>
              </View>
              <Text style={styles.memoryText}>{memory.text}</Text>
            </Animated.View>
          ))}

          {/* Reasons toggle */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💖</Text>
            <Text style={styles.sectionTitle}>
              Tum Special Kyun Ho
            </Text>
          </View>

          <TouchableOpacity
            style={styles.revealButton}
            onPress={() => setShowReasons(!showReasons)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#ff6b9d', '#c44569']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.revealGradient}>
              <Text style={styles.revealText}>
                {showReasons ? 'Chupao 🙈' : 'Dikhao 👀'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {showReasons &&
            reasons.map((item, index) => (
              <ReasonCard key={index} item={item} index={index} />
            ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with all my love 💕
            </Text>
            <Text style={styles.footerEmoji}>
              ❤️ 🧡 💛 💚 💙 💜
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ff6b9d',
    textShadowColor: '#ff6b9d40',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#d4a0b9',
    marginTop: 8,
    fontStyle: 'italic',
  },
  letterCard: {
    backgroundColor: '#2d113350',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#ff6b9d20',
    marginBottom: 30,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  letterEmoji: {
    fontSize: 24,
  },
  letterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff6b9d',
  },
  letterDivider: {
    height: 1,
    backgroundColor: '#ff6b9d20',
    marginBottom: 16,
  },
  letterText: {
    fontSize: 16,
    color: '#e8c8d8',
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 10,
  },
  sectionEmoji: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ff6b9d',
  },
  memoryCard: {
    backgroundColor: '#2d113340',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ff6b9d15',
    marginBottom: 14,
  },
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  memoryEmoji: {
    fontSize: 22,
  },
  memoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#d4a0b9',
  },
  memoryText: {
    fontSize: 15,
    color: '#c4a0b4',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  revealButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#ff6b9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  revealGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  revealText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d113340',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff6b9d15',
    gap: 14,
  },
  reasonEmoji: {
    fontSize: 26,
  },
  reasonText: {
    fontSize: 15,
    color: '#e8c8d8',
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6b4a6e',
    marginBottom: 8,
  },
  footerEmoji: {
    fontSize: 18,
    letterSpacing: 6,
  },
});
