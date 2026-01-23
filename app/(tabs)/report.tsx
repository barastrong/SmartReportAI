import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView 
} from "react-native";
import { ReportCard } from "@/components/reportcard";
import { 
  Sparkles, 
  Info, 
  Heart, 
  Brain, 
  Star 
} from "lucide-react-native"; // Import Ikon

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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* JUDUL HALAMAN */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Laporan Mingguan</Text>
          <Text style={styles.subtitle}>
            Analisis kecerdasan buatan untuk aktivitasmu
          </Text>
        </View>

        {/* AI SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.aiBadge}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.aiBadgeText}>AI INSIGHT</Text>
            </View>
          </View>
          <Text style={styles.summaryText}>
            Berdasarkan data minggu ini, kamu menunjukkan stabilitas pada kesehatan mental, namun perlu memperhatikan durasi tidur harianmu. 
            <Text style={styles.highlightText}> Fokus tingkatkan konsistensi olahraga!</Text>
          </Text>
        </View>

        {/* LIST LAPORAN DENGAN IKON */}
        <View style={styles.listContainer}>
          
          <ReportCard
            title="Physical Health"
            score={78}
            recommendation="Tingkatkan durasi tidur menjadi 7-8 jam per malam. Tambahkan aktivitas cardio ringan di pagi hari."
            icon={<Heart size={20} color="red" />} // Kirim ikon sebagai prop
          />

          <ReportCard
            title="Mental Health"
            score={85}
            recommendation="Sangat baik! Pertahankan rutinitas mindfulness dan kurangi penggunaan gadget sebelum tidur."
            icon={<Brain size={20} color="blue" />} // Kirim ikon sebagai prop
          />

          <ReportCard
            title="Character"
            score={72}
            recommendation="Kedisiplinan meningkat, namun tingkat empati perlu perhatian lebih melalui interaksi sosial."
            icon={<Star size={20} color="orange" />} // Kirim ikon sebagai prop
          />

        </View>

        {/* INFO BOX */}
        <View style={styles.infoBox}>
          <Info size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            Data diperbarui secara otomatis setiap hari Senin pukul 00.00.
          </Text>
        </View>

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