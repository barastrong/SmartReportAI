import { ActivityForm } from "@/components/activityform";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityTabScreen() {
  const router = useRouter();

  const handleActivitySubmitted = useCallback(() => {
    // Navigate to report tab untuk lihat hasil AI
    router.push("/(tabs)/report");
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>Input Aktivitas</Text>
          <Text style={styles.subtitle}>
            Catat aktivitas harianmu untuk evaluasi AI
          </Text>
        </View>

        <View style={styles.card}>
          <ActivityForm onUpdate={handleActivitySubmitted} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 24 },
  textContainer: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#64748b" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
});
