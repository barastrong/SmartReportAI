import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { BarChart3, Cpu, Sparkles } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// PALET WARNA MINT FRESH
const COLORS = {
  background: "#F6FBF7", // Minty White
  surface: "#FFFFFF", // Card White
  primary: "#10b981", // Mint Green (Utama)
  secondary: "#89ceb5", // Soft Mint
  accent: "#DCEFE6", // Pale Mint
  textMain: "#1F2937", // Dark Slate
  textSecondary: "#6B7280", // Slate Grey
  border: "#E5E7EB", // Light Grey
};

const onboardingData = [
  {
    id: 1,
    title: "Smart Technology\nReporting",
    description:
      "Evaluasi aktivitas harianmu dengan teknologi AI yang cerdas untuk hasil yang lebih terukur.",
    icon: <Cpu size={100} color={COLORS.primary} strokeWidth={1.5} />,
  },
  {
    id: 2,
    title: "Insight & AI\nAssistance",
    description:
      "Dapatkan analisis mendalam mengenai kesehatan fisik dan mentalmu langsung setiap hari.",
    icon: <BarChart3 size={100} color={COLORS.primary} strokeWidth={1.5} />,
  },
  {
    id: 3,
    title: "Ready to Start\nYour Journey?",
    description:
      "Siap menjadi versi terbaik dirimu? Ayo mulai perjalanan transformasimu bersama kami.",
    icon: <Sparkles size={100} color={COLORS.primary} strokeWidth={1.5} />,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkSeen = async () => {
      try {
        const seen = await AsyncStorage.getItem("has_seen_onboarding");
        if (seen === "true") {
          router.replace("/login");
        }
      } catch (error) {
        console.log("Error checking onboarding status:", error);
      }
    };
    checkSeen();
  }, [router]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isLastScreen = currentIndex === onboardingData.length - 1;
  const currentContent = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        {/* Lingkaran Ilustrasi di atas Surface White */}
        <View style={styles.illustrationCircle}>{currentContent.icon}</View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentContent.title}</Text>
          <Text style={styles.description}>{currentContent.description}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {/* Dots Indikator (Sesuai Referensi Gambar) */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index
                  ? { width: 22, backgroundColor: COLORS.primary }
                  : { width: 8, backgroundColor: COLORS.accent },
              ]}
            />
          ))}
        </View>

        {/* Tombol Navigasi */}
        {!isLastScreen ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.finalContainer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={async () => {
                try {
                  await AsyncStorage.setItem("has_seen_onboarding", "true");
                } catch (e) {
                  console.log("Error setting onboarding status:", e);
                }
                router.replace("/login");
              }}
            >
              <Text style={styles.getStartedText}>Ayo Mulai</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textMain,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingBottom: 50,
    height: 140,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  finalContainer: {
    alignItems: "flex-end",
    width: width * 0.5,
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  authLink: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
