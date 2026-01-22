import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit"; // Import Chart Beneran
import { StatCard } from "@/components/statcard"; 
import { AppButton } from "@/components/ui/appbutton"; 
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;


const DashboardScreen: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    if (screen === "activity") {
      router.push("/activity");
    } else if (screen === "report") {
      router.push("/report");
    } else if (screen === "profile") {
      router.push("/profile");
    } else {
      router.push("/");
    }
  };

  // Data untuk Grafik Mingguan
  const chartData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        data: [40, 60, 85, 70, 95, 110, 125],
      },
    ],
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
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.userName}>Halo, User 👋</Text>
          <Text style={styles.subtitle}>Bagaimana kabarmu hari ini?</Text>
        </View>

        {/* Stat Cards Section */}
        <View style={styles.statsGrid}>
          <StatCard title="Skor Kesehatan" score={78} type="health" />
          <StatCard title="Skor Mental" score={85} type="mental" />
          <StatCard title="Skor Karakter" score={72} type="character" />
        </View>

        {/* Real Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartHeader}>📊 Trend Mingguan</Text>
          <View style={styles.chartWrapper}>
            <BarChart
              data={chartData}
              width={screenWidth - 80} // Menyesuaikan lebar card
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
    marginLeft: -15, // Mengimbangi padding bawaan chart kit
  },
  actionSection: {
    marginTop: 10,
  },
});

export default DashboardScreen;