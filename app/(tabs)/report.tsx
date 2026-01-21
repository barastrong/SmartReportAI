import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, Info } from "lucide-react-native";
import { AppButton } from "@/components/ui/appbutton"; // Pastikan path benar
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const ReportScreen = () => {
  const router = useRouter();

  const handleGoToActivity = () => {
    // Navigasi ke tab activity
    router.push("/activity");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Lingkaran Ikon */}
        <View style={styles.iconCircle}>
          <BarChart3 size={60} color="#2563eb" strokeWidth={1.5} />
        </View>

        {/* Teks Informasi */}
        <Text style={styles.title}>Belum Ada Laporan</Text>
        <Text style={styles.description}>
          Analisis AI akan muncul di sini setelah kamu mencatat aktivitas harianmu. Mulailah mencatat hari ini!
        </Text>

        {/* Tip Box (Opsional) */}
        <View style={styles.tipBox}>
          <Info size={18} color="#64748b" />
          <Text style={styles.tipText}>
            Tip: Catat aktivitas minimal 3 hari berturut-turut untuk mendapatkan tren kesehatan yang akurat.
          </Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.buttonContainer}>
          <AppButton 
            title="Catat Aktivitas Sekarang" 
            variant="primary" 
            onPress={handleGoToActivity} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    // Memberikan sedikit offset ke atas agar tidak terlalu di tengah mati
    paddingBottom: height * 0.1,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  buttonContainer: {
    width: "100%",
  },
});

export default ReportScreen;