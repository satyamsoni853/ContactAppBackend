import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Floating heart component
const FloatingHeart = ({ delay, startX }: { delay: number; startX: number }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(height + 50);
      opacity.setValue(0);
      scale.setValue(0.3 + Math.random() * 0.5);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 6000 + Math.random() * 4000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: startX + (Math.random() - 0.5) * 80,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: startX + (Math.random() - 0.5) * 80,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        fontSize: 20 + Math.random() * 16,
        transform: [{ translateY }, { translateX }, { scale }],
        opacity,
      }}>
      {['❤️', '💕', '💗', '🌹', '✨', '💖', '💝'][Math.floor(Math.random() * 7)]}
    </Animated.Text>
  );
};

// Pulsing heart
const PulsingHeart = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text style={[styles.bigHeart, { transform: [{ scale }] }]}>
      💔
    </Animated.Text>
  );
};

export default function HomeScreen() {
  const [step, setStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const noBtnSize = useRef(new Animated.Value(1)).current;

  // Surprise Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSurpriseUnlocked, setIsSurpriseUnlocked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const TWELVE_HOURS = 12 * 60 * 60 * 1000;

  const hasShownAlert = useRef(false);

  useEffect(() => {
    const checkTimer = async () => {
      try {
        let startTime = await AsyncStorage.getItem('surprise_start_time');
        if (!startTime) {
          startTime = Date.now().toString();
          await AsyncStorage.setItem('surprise_start_time', startTime);
        }

        const elapsed = Date.now() - parseInt(startTime);
        if (elapsed >= TWELVE_HOURS) {
          setIsSurpriseUnlocked(true);
          setTimeLeft(0);
        } else {
          const remaining = TWELVE_HOURS - elapsed;
          setTimeLeft(remaining);

          // Show alert on first mount
          if (!hasShownAlert.current) {
            hasShownAlert.current = true;
            Alert.alert(
              "✨ Surprise Alert! ✨",
              `Don't delete the app! Just wait ${formatTime(remaining)} more for your surprise! ❤️`,
              [{ text: "OK ❤️" }]
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkTimer();

    const interval = setInterval(() => {
      checkTimer();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getLoveDays = () => {
    const startDate = new Date('2024-07-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const animateTransition = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNo = () => {
    setNoCount(noCount + 1);
    // No button shrinks each time
    Animated.timing(noBtnSize, {
      toValue: Math.max(0.3, 1 - noCount * 0.15),
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleYes = () => {
    animateTransition(3);
  };

  const messages = [
    {
      emoji: '🥀',
      title: 'Mere Dil Ki Baat...',
      subtitle: 'Tanya, tumhare bina sab kuch adhura hai',
      body: 'Main jaanta hoon ki pichle kuch dinon mein maine bohot galtiyan ki hain.\nTanya Soni, tum meri life ki sabse badi khushi ho aur maine usi khushi ko dukh diya...\nSatyam ko sach mein bohot regret ho raha hai baby. 😭',
      buttonText: 'Thoda aur suno... 💔',
    },
    {
      emoji: '🕯️',
      title: 'Sirf Tumhare Liye...',
      subtitle: 'Tanya, tum meri rooh ka hissa ho',
      body: 'Main har pal sirf tumhare baare mein sochta hoon.\nTumhara gussa hona jayaz hai, par tumhara door jaana meri maut ke barabar hai.\nTanya, please ek baar mujhe maaf kar do, main sab theek kar dunga.\nMain tumhare trust ko phir se jeetunga, yeh mera waada hai. 💍',
      buttonText: 'Aakhri baar ek promise... 🌹',
    },
    {
      emoji: '💍',
      title: 'Maafi Ka Ek Mauka?',
      subtitle: 'Bas ek mauka Satyam ko sudharne ka',
      body: 'Tanya, kya tum Satyam ko ek aakhri mauka de sakti ho?\nMain promise karta hoon ki ab se har aansu tumhari aankhon mein sirf khushi ka hoga.\nMain tumhe pehle se bhi zyada pyaar karunga aur hamesha tumhare saath khada rahunga.\n\nMaaf karogi Satyam ko? 🥺',
      buttonText: null, // show yes/no buttons
    },
    {
      emoji: '🏹❤️',
      title: 'TANYA + SATYAM = FOREVER!',
      subtitle: 'Ab hum kabhi alag nahi honge',
      body: 'Tanya Soni, tumne haan keh kar Satyam ko nayi zindagi di hai!\nMain tumhara haath kabhi nahi chhodunga.\nTum meri "Last Love" ho aur hamesha rahogi.\nI Love You Infinite, My Queen! 🥰👑',
      buttonText: null,
    },
  ];

  const current = messages[step];

  // Images for gallery
  const galleryImages = [
    require('../../assets/images/love1.png'),
    require('../../assets/images/love2.png'),
    require('../../assets/images/love3.png'),
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a1e', '#2d1133', '#1a0a1e']}
        style={styles.gradient}>
        
        {/* Floating hearts background */}
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingHeart
            key={i}
            delay={i * 800}
            startX={Math.random() * width}
          />
        ))}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            
            {/* Surprise Countdown Section - AT THE TOP */}
            <View style={[styles.surpriseSection, { marginTop: 0, marginBottom: 20 }]}>
              <Text style={styles.surpriseTitle}>✨ Surprise For You ✨</Text>
              {!isSurpriseUnlocked ? (
                <View style={styles.lockedContainer}>
                  <Text style={styles.lockedText}>Wait for {timeLeft !== null ? formatTime(timeLeft) : '12 hours'} for Surprise</Text>
                  <View style={styles.warningBox}>
                    <Text style={styles.warningText}>⚠️ Don't delete the app! ⚠️</Text>
                  </View>
                  <Text style={styles.lockedSubtext}>
                    Just wait for 12 hours to make you feel happy! ❤️
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.unlockedButton}
                  onPress={() => setShowNotes(true)}>
                  <LinearGradient
                    colors={['#ffd700', '#ffa500']}
                    style={styles.unlockedGradient}>
                    <Text style={styles.unlockedText}>Dabaao Isse! 🎁</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* NEW: Love Counter Badge */}
            <View style={styles.loveCounter}>
              <Ionicons name="heart" size={24} color="#ffd700" />
              <Text style={styles.counterText}>Our Love: {getLoveDays()} Days</Text>
            </View>

            {/* NEW: Romantic Gallery */}
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}>
              {galleryImages.map((img, i) => (
                <View key={i} style={styles.galleryItem}>
                  <Image source={img} style={styles.galleryImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(26, 10, 30, 0.8)']}
                    style={styles.galleryOverlay}
                  />
                  <Text style={styles.galleryCaption}>
                    {i === 0 && "Tanya Soni, You're the Best"}
                    {i === 1 && "Satyam Loves You"}
                    {i === 2 && "Forever Together"}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Main emoji */}
            {step === 3 ? (
              <Text style={styles.bigHeart}>🥰</Text>
            ) : step === 2 ? (
              <PulsingHeart />
            ) : (
              <Text style={styles.bigHeart}>{current.emoji}</Text>
            )}

            {/* Decorative line */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerEmoji}>✨</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Title */}
            <Text style={styles.title}>{current.title}</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{current.subtitle}</Text>

            {/* Body card */}
            <View style={styles.messageCard}>
              <View style={styles.cardGlow} />
              <Text style={styles.messageText}>{current.body}</Text>
            </View>

            {/* Buttons */}
            {step < 2 && current.buttonText && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => animateTransition(step + 1)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ff6b9d', '#c44569']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>{current.buttonText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Yes/No buttons for step 2 */}
            {step === 2 && (
              <View style={styles.choiceContainer}>
                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={handleYes}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#ff6b9d', '#ff4081', '#e91e63']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.yesGradient}>
                    <Text style={styles.yesText}>Haan, Maaf Kiya! 💕</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ scale: noBtnSize }] }}>
                  <TouchableOpacity
                    style={styles.noButton}
                    onPress={handleNo}
                    activeOpacity={0.8}>
                    <Text style={styles.noText}>Nahi 😤</Text>
                  </TouchableOpacity>
                </Animated.View>

                {noCount > 0 && (
                  <Text style={styles.pleadText}>
                    {noCount === 1 && 'Please baby... ek baar soch lo 🥺'}
                    {noCount === 2 && 'Arey yaar... sachchi sorry bol raha hoon 😢'}
                    {noCount === 3 && 'Dekho na... rona aa jayega mujhe 😭'}
                    {noCount >= 4 && 'OK ab toh haan bol do... No button bhi chota ho gaya 😭💔'}
                  </Text>
                )}
              </View>
            )}

            {/* Celebration for step 3 */}
            {step === 3 && (
              <View style={styles.celebrationContainer}>
                <Text style={styles.celebrationEmojis}>
                  🎉 💕 🌹 💖 🎉
                </Text>
                <View style={styles.promiseCard}>
                  <Text style={styles.promiseTitle}>Mera Promise 💍</Text>
                  <Text style={styles.promiseText}>
                    ✅ Tumhe hamesha khush rakhunga{'\n'}
                    ✅ Kabhi jhooth nahi bolunga{'\n'}
                    ✅ Tumhari har baat sunuuga{'\n'}
                    ✅ Tumse pyaar kam nahi hoga{'\n'}
                    ✅ Galti hogi toh bol dunga{'\n'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.restartButton, { backgroundColor: '#ff6b9d20', marginBottom: 15 }]}
                  onPress={() => {
                    import('expo-linking').then(Linking => {
                      Linking.openURL('https://tanyalove.vercel.app/');
                    });
                  }}>
                  <Text style={[styles.restartText, { color: '#ff6b9d', fontWeight: '700' }]}>
                    Hamari saari yaadein dekho 🌐
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={() => {
                    setStep(0);
                    setNoCount(0);
                    noBtnSize.setValue(1);
                  }}>
                  <Text style={styles.restartText}>Phir se padho 🔄</Text>
                </TouchableOpacity>
              </View>
            )}

          </Animated.View>
        </ScrollView>

        {/* Surprise Notes Modal */}
        <Modal
          visible={showNotes}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNotes(false)}>
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#2d1133', '#1a0a1e']}
              style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <Text style={styles.modalEmoji}>💌</Text>
                <Text style={styles.modalTitle}>Meri Pyari Tanya Ke Liye...</Text>
                
                <View style={styles.noteCard}>
                  <Text style={styles.noteText}>
                    Tanya, aaj hamari zindagi ka ek naya panna shuru ho raha hai. Main jaanta hoon ki pichle kuch din mushkil rahe hain, par mera pyaar tumhare liye kabhi kam nahi hua. 
                    {'\n\n'}
                    Main chahta hoon ki tum hamesha khush raho. Yeh app sirf ek zariya hai tumhe batane ka ki Satyam hamesha tumhare saath hai, chahe kuch bhi ho jaye.
                    {'\n\n'}
                    Tum meri life ki sabse badi blessing ho. I promise to be a better person for you, every single day. 💕
                    {'\n\n'}
                    Love you hamesha! ❤️
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowNotes(false)}>
                  <Text style={styles.closeButtonText}>Band Karo ❌</Text>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </View>
        </Modal>
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  bigHeart: {
    fontSize: 80,
    marginBottom: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '60%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ff6b9d40',
  },
  dividerEmoji: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ff6b9d',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#ff6b9d60',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#d4a0b9',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  messageCard: {
    backgroundColor: '#2d113380',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ff6b9d25',
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ff6b9d10',
  },
  messageText: {
    fontSize: 18,
    color: '#e8c8d8',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.3,
  },
  nextButton: {
    width: '80%',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#ff6b9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  choiceContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 15,
  },
  yesButton: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  yesGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  yesText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  noButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6b4a6e',
    backgroundColor: '#1a0a1e',
  },
  noText: {
    color: '#6b4a6e',
    fontSize: 14,
    fontWeight: '500',
  },
  pleadText: {
    fontSize: 15,
    color: '#ff6b9d',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  celebrationContainer: {
    alignItems: 'center',
    width: '100%',
  },
  celebrationEmojis: {
    fontSize: 30,
    marginBottom: 20,
    letterSpacing: 8,
  },
  promiseCard: {
    backgroundColor: '#ff6b9d15',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ff6b9d30',
    marginBottom: 20,
  },
  promiseTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ff6b9d',
    textAlign: 'center',
    marginBottom: 16,
  },
  promiseText: {
    fontSize: 16,
    color: '#e8c8d8',
    lineHeight: 32,
    letterSpacing: 0.3,
  },
  restartButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6b9d40',
  },
  restartText: {
    color: '#d4a0b9',
    fontSize: 14,
  },
  surpriseSection: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff10',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd70040',
  },
  surpriseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffd700',
    marginBottom: 15,
  },
  lockedContainer: {
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  lockedSubtext: {
    fontSize: 14,
    color: '#ffd70080',
    marginTop: 5,
  },
  unlockedButton: {
    width: '80%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
  },
  unlockedGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    color: '#2d1133',
    fontSize: 20,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  modalScroll: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ff6b9d',
    textAlign: 'center',
    marginBottom: 25,
  },
  noteCard: {
    backgroundColor: '#ffffff08',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ff6b9d30',
  },
  noteText: {
    fontSize: 18,
    color: '#e8c8d8',
    lineHeight: 30,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#ff6b9d20',
  },
  closeButtonText: {
    color: '#ff6b9d',
    fontWeight: '700',
  },
  warningBox: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  warningText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  loveCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd70015',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd70040',
    marginBottom: 25,
  },
  counterText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  galleryScroll: {
    height: 300,
    width: width - 48,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  galleryItem: {
    width: width - 48,
    height: 300,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  galleryCaption: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
