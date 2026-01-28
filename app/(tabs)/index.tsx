import { StatCard } from "@/components/statcard";
import { AppButton } from "@/components/ui/appbutton";
import { apiClient } from "@/services/api";
import { useFocusEffect, useRouter } from "expo-router";
import {
  BarChart3,
  Check,
  FileText,
  HelpCircle,
  UserCircle,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [userName, setUserName] = useState("User");
  const [healthScore, setHealthScore] = useState(0);
  const [mentalScore, setMentalScore] = useState(0);
  const [characterScore, setCharacterScore] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-update ketika screen di-focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, []),
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileResponse = await apiClient.getProfile();
      setUserName(profileResponse.user.name || "User");

      // Fetch latest activity
      try {
        const activityResponse = await apiClient.getLatestActivity();

        if (activityResponse.activity) {
          setHealthScore(activityResponse.activity.physical_score || 0);
          setMentalScore(activityResponse.activity.mental_score || 0);
          setCharacterScore(activityResponse.activity.character_score || 0);
        }
      } catch {
        console.log("No latest activity yet");
      }

      // Fetch all activities for trend chart
      try {
        const activitiesResponse = await apiClient.getActivities();

        if (
          activitiesResponse.activities &&
          activitiesResponse.activities.length > 0
        ) {
          // Group activities by day of week
          const dayScores: { [key: number]: number[] } = {
            0: [], // Minggu
            1: [], // Senin
            2: [], // Selasa
            3: [], // Rabu
            4: [], // Kamis
            5: [], // Jumat
            6: [], // Sabtu
          };

          // Calculate scores for each activity and group by day
          activitiesResponse.activities.forEach((activity: any) => {
            const date = new Date(activity.created_at);
            const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, etc

            const avgScore = Math.round(
              (activity.physical_score +
                activity.mental_score +
                activity.character_score) /
                3,
            );

            dayScores[dayOfWeek].push(avgScore);
          });

          // Calculate average for each day
          const trendData = [0, 1, 2, 3, 4, 5, 6].map((day) => {
            const scores = dayScores[day];
            if (scores.length === 0) return 0;
            return Math.round(
              scores.reduce((a, b) => a + b, 0) / scores.length,
            );
          });

          // Reorder to start from Senin (Monday)
          const reorderedData = [
            ...trendData.slice(1), // Senin - Sabtu
            trendData[0], // Minggu di akhir
          ];
          const reorderedLabels = [
            "Sen",
            "Sel",
            "Rab",
            "Kam",
            "Jum",
            "Sab",
            "Min",
          ];

          setChartData({
            labels: reorderedLabels,
            datasets: [
              {
                data: reorderedData,
              },
            ],
          });
        }
      } catch {
        console.log("No activities yet, using default chart data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleNavigation = (screen: string) => {
    if (screen === "activity") {
      router.push("/(tabs)/activity");
    } else if (screen === "report") {
      router.push("/(tabs)/report");
    } else if (screen === "profile") {
      router.push("/(tabs)/profile");
    } else {
      router.push("/(tabs)");
    }
  };

  // Konfigurasi Tampilan Grafik
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Warna Biru #2563eb
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, // Warna Abu-abu
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // Membuat garis latar tidak putus-putus
      stroke: "#f1f5f9", // Warna garis latar halus
    },
    fillShadowGradientOpacity: 1,
    fillShadowGradient: "#21ce94", // Warna isi batang
  };

  return (
    <>
      {/* GUIDE MODAL */}
      <Modal
        visible={showGuide}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideContainer}>
            <View style={styles.guideTitleSection}>
              <HelpCircle size={28} color="#10b981" />
              <Text style={styles.guideTitle}>Panduan Aplikasi</Text>
            </View>

            <ScrollView
              style={styles.guideContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.guideStep}>
                <View style={styles.stepIconContainer}>
                  <Zap size={20} color="#10b981" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepNumber}>Input Aktivitas</Text>
                  <Text style={styles.stepDescription}>
                    Pergi ke tab &#34;Aktivitas&#34; untuk mencatat data harian
                    Anda seperti tidur, olahraga, mood, dan stress level.
                  </Text>
                </View>
              </View>

              <View style={styles.guideStep}>
                <View style={styles.stepIconContainer}>
                  <Zap size={20} color="#3b82f6" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepNumber}>AI Analysis</Text>
                  <Text style={styles.stepDescription}>
                    Setelah submit, AI akan menganalisis data Anda selama kurang
                    lebih 2 menit untuk memberikan score kesehatan Anda.
                  </Text>
                </View>
              </View>

              <View style={styles.guideStep}>
                <View style={styles.stepIconContainer}>
                  <FileText size={20} color="#f59e0b" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepNumber}>Lihat Laporan</Text>
                  <Text style={styles.stepDescription}>
                    Buka tab &#34;Laporan&#34; untuk melihat hasil analisis AI
                    dengan score fisik, mental, dan karakter beserta
                    rekomendasinya.
                  </Text>
                </View>
              </View>

              <View style={styles.guideStep}>
                <View style={styles.stepIconContainer}>
                  <BarChart3 size={20} color="#8b5cf6" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepNumber}>Dashboard Rumah</Text>
                  <Text style={styles.stepDescription}>
                    Di halaman ini, Anda bisa melihat grafik tren mingguan dan
                    score terbaru. Data update otomatis setiap kali kembali ke
                    tab ini.
                  </Text>
                </View>
              </View>

              <View style={styles.guideStep}>
                <View style={styles.stepIconContainer}>
                  <UserCircle size={20} color="#ec4899" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepNumber}>Profil</Text>
                  <Text style={styles.stepDescription}>
                    Kelola profil Anda termasuk foto, nama, dan motto. Setiap
                    update akan tersimpan dan ditampilkan di dashboard.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.guideDismissButton}
              onPress={() => setShowGuide(false)}
            >
              <Check size={20} color="#ffffff" />
              <Text style={styles.guideDismissText}>
                Mengerti, Mulai Sekarang!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <View style={styles.greetingHeader}>
              <View>
                <Text style={styles.userName}>Halo, {userName} 👋</Text>
                <Text style={styles.subtitle}>Bagaimana kabarmu hari ini?</Text>
              </View>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => setShowGuide(true)}
              >
                <HelpCircle size={24} color="#10b981" />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loaderText}>Memuat data...</Text>
            </View>
          ) : (
            <>
              {/* Stat Cards Section */}
              <View style={styles.statsGrid}>
                <StatCard
                  title="Skor Kesehatan"
                  score={healthScore}
                  type="health"
                />
                <StatCard
                  title="Skor Mental"
                  score={mentalScore}
                  type="mental"
                />
                <StatCard
                  title="Skor Karakter"
                  score={characterScore}
                  type="character"
                />
              </View>

              {/* Real Chart Section */}
              <View style={styles.chartCard}>
                <Text style={styles.chartHeader}>📊 Trend Mingguan</Text>
                <View style={styles.chartWrapper}>
                  <BarChart
                    data={chartData}
                    width={screenWidth - 80}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    fromZero={true}
                    showBarTops={false}
                    withInnerLines={true}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
              </View>
            </>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <AppButton
              title="📝 Isi Aktivitas Harian"
              variant="primary"
              onPress={() => handleNavigation("activity")}
            />
            <View style={{ height: 12 }} />
            <AppButton
              title="📄 Lihat Smart Report"
              variant="outline"
              onPress={() => handleNavigation("report")}
            />
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 24,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  helpButton: {
    padding: 8,
  },
  userName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  loaderContainer: {
    alignItems: "center",
    paddingVertical: 100,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  statsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  chartHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
    marginLeft: 4,
  },
  chartWrapper: {
    alignItems: "center",
    marginLeft: -15,
  },
  actionSection: {
    marginTop: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  guideContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    maxHeight: "85%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  guideTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 12,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
  guideContent: {
    marginBottom: 20,
  },
  guideStep: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 12,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
  },
  guideDismissButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  guideDismissText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DashboardScreen;
