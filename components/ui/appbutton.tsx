import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "success" | "destructive" | "danger";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  children,
  disabled,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outline;
      case "destructive":
        return styles.destructive;
      case "danger":
        return styles.danger;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    if (variant === "outline" || variant === "danger") {
      return variant === "danger" ? styles.textDanger : styles.textOutline;
    }
    return styles.textPrimary;
  };

  return (
    <TouchableOpacity
      style={[styles.base, getButtonStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
      <Text style={[styles.textBase, getTextStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  primary: { backgroundColor: "#2563eb" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  destructive: { backgroundColor: "#ef4444" },
  danger: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  disabled: { opacity: 0.5 },
  textBase: { fontSize: 16, fontWeight: "600" },
  textPrimary: { color: "#ffffff" },
  textOutline: { color: "#64748b" },
  textDanger: { color: "#ef4444" },
});
