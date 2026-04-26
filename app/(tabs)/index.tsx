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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      emoji: '💔',
      title: 'Hey Tanya...',
      subtitle: 'Satyam se bohot badi galti ho gayi hai',
      body: 'Tanya Soni, tum duniya ki sabse pyaari ladki ho\naur maine tumhe hurt kiya...\nI am really really sorry baby 😢',
      buttonText: 'Aage padho... →',
    },
    {
      emoji: '😢',
      title: 'Meri Galti Hai...',
      subtitle: 'Main accept karta hoon apni saari galtiyan',
      body: 'Tanya, tumhare saath jo bhi hua\nwo sab Satyam ki wajah se hua.\nMain jaanta hoon ki maine\ntumhara trust toda hai.\n\nPar please ek baar meri baat suno... 🙏',
      buttonText: 'Satyam ka promise suno... →',
    },
    {
      emoji: '🙏',
      title: 'Ek Chance Do Please...',
      subtitle: 'Bas ek aur mauka chahiye Tanya ko',
      body: 'Main promise karta hoon ki\nab se Tanya Soni ko kabhi hurt nahi karunga.\nTum meri duniya ho,\ntumhare bina Satyam kuch nahi hai.\n\nKya tum Satyam ko maaf kar sakti ho? 🥺',
      buttonText: null, // show yes/no buttons
    },
    {
      emoji: '🥰',
      title: 'I LOVE YOU TANYA!! 💕',
      subtitle: 'Satyam + Tanya = Forever ❤️',
      body: 'Tanya, tum duniya ki best girlfriend ho!\nMain tumhe kabhi lose nahi karunga.\nAb se sirf khushiyan hi khushiyan! 🌹\n\nSatyam tumhara hi hai, hamesha ❤️',
      buttonText: null,
    },
  ];

  const current = messages[step];

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
});
