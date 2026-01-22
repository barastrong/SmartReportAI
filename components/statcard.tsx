import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Heart, Brain, Star } from "lucide-react-native";

interface StatCardProps {
  title: string;
  score: number;
  type: "health" | "mental" | "character";
  style?: ViewStyle; // Pengganti className
}

const iconMap = {
  health: Heart,
  mental: Brain,
  character: Star,
};

const colorMap = {
  health: "#ef4444",    // red-500
  mental: "#2563eb",    // primary/blue-600
  character: "#f59e0b", // amber-500
};

export const StatCard: React.FC<StatCardProps> = ({ title, score, type, style }) => {
  const Icon = iconMap[type];
  const iconColor = colorMap[type];

  return (
    <View style={[styles.card, style]}>
      {/* Icon Container */}
      <View style={styles.iconContainer}>
        <Icon size={24} color={iconColor} />
      </View>

      {/* Text Container */}
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    // Shadow untuk iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Shadow untuk Android
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f8fafc", // slate-50
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b", // muted-foreground / slate-500
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b", // foreground / slate-800
  },
});