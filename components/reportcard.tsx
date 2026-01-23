import React from "react";
import { View, Text, StyleSheet } from "react-native";

const COLORS = {
  background: "#F6FBF7",
  surface: "#FFFFFF",
  primary: "#10b981",
  secondary: "#89ceb5",
  accent: "#DCEFE6",
  textMain: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  error: "#ef4444",
  warning: "#f59e0b",
};

interface ReportCardProps {
  title: string;
  score: number;
  maxScore?: number;
  recommendation: string;
  icon?: React.ReactNode; // Prop untuk icon
}

const getLabel = (score: number): { text: string; color: string } => {
  if (score >= 85) return { text: "Sangat Baik", color: COLORS.primary };
  if (score >= 70) return { text: "Baik", color: COLORS.secondary };
  if (score >= 50) return { text: "Cukup", color: COLORS.warning };
  return { text: "Perlu Introspeksi", color: COLORS.error };
};

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  score,
  maxScore = 100,
  recommendation,
  icon,
}) => {
  const { text, color } = getLabel(score);
  const percentage = Math.min((score / maxScore) * 100, 100);

  return (
    <View style={styles.card}>
      {/* Header dengan Icon */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={[styles.label, { color }]}>{text}</Text>
      </View>

      {/* Score Section */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreContainer}>
          <Text style={styles.bigScore}>{score}</Text>
          <Text style={styles.maxScore}>/{maxScore}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${percentage}%`, backgroundColor: color } // Bar mengikuti warna label
              ]} 
            />
          </View>
        </View>
      </View>

      {/* AI Recommendation */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationHeader}>💡 AI Recommendation</Text>
        <Text style={styles.recommendationText}>{recommendation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24, // Lebih rounded agar modern
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textMain,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bigScore: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.textMain,
    lineHeight: 56,
  },
  maxScore: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  progressSection: {
    width: "100%",
    marginTop: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 5,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  recommendationBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  recommendationHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 22,
  },
});