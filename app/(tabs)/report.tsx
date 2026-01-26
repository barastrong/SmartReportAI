import { ReportCard } from "@/components/reportcard";
import { apiClient } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { Brain, Heart, Info, Sparkles, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView  } from "react-native-safe-area-context";


const COLORS = {
  background: "#F6FBF7",
  surface: "#FFFFFF",
  primary: "#10b981",
  secondary: "#89ceb5",
  accent: "#DCEFE6",
  textMain: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
};

const ReportScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activityData, setActivityData] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    fetchLatestActivity();
  }, []);

  // Auto-update ketika screen di-focus
  useFocusEffect(
    useCallback(() => {
      fetchLatestActivity();
    }, []),
  );

  const fetchLatestActivity = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLatestActivity();

      console.log("📊 Activity data fetched:", response);

      if (response.activity) {
        setActivityData(response.activity);

        // Create prediction object from stored scores
        setPrediction({
          Physical: {
            label: "Kesehatan Fisik",
            score: response.activity.physical_score,
            summary: "Berdasarkan data tidur dan olahraga kamu.",
          },
          Mental: {
            label: "Kesehatan Mental",
            score: response.activity.mental_score,
            summary: "Berdasarkan mood dan stress level kamu.",
          },
          Character: {
            label: "Karakter",
            score: response.activity.character_score,
            summary: "Berdasarkan disiplin dan empati kamu.",
          },
          Summary:
            response.activity.summary ||
            "Tingkatkan konsistensi dalam aktivitas harianmu.",
        });
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLatestActivity();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* JUDUL HALAMAN */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Laporan Mingguan</Text>
          <Text style={styles.subtitle}>
            Analisis kecerdasan buatan untuk aktivitasmu
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Memuat laporan...</Text>
          </View>
        ) : prediction ? (
          <>
            {/* AI SUMMARY CARD */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.aiBadge}>
                  <Sparkles size={14} color="#FFFFFF" />
                  <Text style={styles.aiBadgeText}>AI INSIGHT</Text>
                </View>
              </View>
              <Text style={styles.summaryText}>{prediction.Summary}</Text>
            </View>

            {/* LIST LAPORAN DENGAN IKON */}
            <View style={styles.listContainer}>
              <ReportCard
                title={prediction.Physical?.label || "Physical Health"}
                score={prediction.Physical?.score || 0}
                recommendation={prediction.Physical?.summary || ""}
                icon={<Heart size={20} color="red" />}
              />

              <ReportCard
                title={prediction.Mental?.label || "Mental Health"}
                score={prediction.Mental?.score || 0}
                recommendation={prediction.Mental?.summary || ""}
                icon={<Brain size={20} color="blue" />}
              />

              <ReportCard
                title={prediction.Character?.label || "Character"}
                score={prediction.Character?.score || 0}
                recommendation={prediction.Character?.summary || ""}
                icon={<Star size={20} color="orange" />}
              />
            </View>

            {/* INFO BOX */}
            <View style={styles.infoBox}>
              <Info size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>
                Terakhir diperbarui:{" "}
                {activityData?.created_at
                  ? new Date(activityData.created_at).toLocaleDateString(
                      "id-ID",
                    )
                  : "N/A"}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada data laporan</Text>
            <Text style={styles.emptySubtext}>
              Mulai dengan mengisi form aktivitas hari ini
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textMain,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textMain,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  summaryHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  aiBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 15,
    color: COLORS.textMain,
    lineHeight: 24,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  listContainer: {
    gap: 16,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    padding: 14,
    borderRadius: 16,
    marginTop: 24,
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default ReportScreen;
