import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider"; // Import Slider
import { AppButton } from "./ui/appbutton"; 

interface ActivityData {
  sleepHours: number;
  exerciseMinutes: number;
  mood: number;
  stress: number;
  discipline: number;
  empathy: number;
}

const moodLabels = ["😩 Lelah Hidup", "😔 Kurang Oke", "😐 Biasa", "😊 Lumayan", "😇 Damai Dunia"];
const stressLabels = ["🧘 Tenang", "😌 Santai", "😬 Agak Stress", "😰 Stress", "🤯 Burnout"];
const disciplineLabels = ["😴 Mager Total", "🐌 Lambat", "🚶 Biasa", "🏃 Rajin", "🔥 Super Disiplin"];
const empathyLabels = ["🙄 Cuek", "🤷 Lumayan Cuek", "😐 Biasa", "🤗 Perhatian", "😇 Malaikat"];

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange, labels }) => {
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.valueLabel}>{labels[Math.round(value) - 1]}</Text>
      </View>
      
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={(val) => onChange(val)}
        minimumTrackTintColor="#10b981" // Warna garis kiri
        maximumTrackTintColor="#a1a6ac" // Warna garis kanan
        thumbTintColor="#10b981"        // Warna bulatan penggeser
      />
      
      <View style={styles.rangeIndicator}>
        <Text style={styles.rangeText}>1</Text>
        <Text style={styles.rangeText}>2</Text>
        <Text style={styles.rangeText}>3</Text>
        <Text style={styles.rangeText}>4</Text>
        <Text style={styles.rangeText}>5</Text>
      </View>
    </View>
  );
};

export const ActivityForm: React.FC = () => {
  const [data, setData] = useState<ActivityData>({
    sleepHours: 7,
    exerciseMinutes: 30,
    mood: 3,
    stress: 3,
    discipline: 3,
    empathy: 3,
  });

  const handleSave = () => {
    console.log("📊 Data Aktivitas:", data);
    Alert.alert("Berhasil!", "Data aktivitas berhasil dicatat.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Input Numerik */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Jam Tidur</Text>
        <View style={styles.numericInputRow}>
          <TextInput
            style={styles.numericInput}
            keyboardType="numeric"
            value={data.sleepHours.toString()}
            onChangeText={(val) => setData({ ...data, sleepHours: Number(val) || 0 })}
          />
          <Text style={styles.unitText}>jam</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Menit Olahraga</Text>
        <View style={styles.numericInputRow}>
          <TextInput
            style={styles.numericInput}
            keyboardType="numeric"
            value={data.exerciseMinutes.toString()}
            onChangeText={(val) => setData({ ...data, exerciseMinutes: Number(val) || 0 })}
          />
          <Text style={styles.unitText}>menit</Text>
        </View>
      </View>

      {/* Slider Inputs */}
      <SliderInput
        label="Mood Hari Ini"
        value={data.mood}
        onChange={(v) => setData({ ...data, mood: v })}
        labels={moodLabels}
      />

      <SliderInput
        label="Level Stres"
        value={data.stress}
        onChange={(v) => setData({ ...data, stress: v })}
        labels={stressLabels}
      />

      <SliderInput
        label="Tingkat Disiplin"
        value={data.discipline}
        onChange={(v) => setData({ ...data, discipline: v })}
        labels={disciplineLabels}
      />

      <SliderInput
        label="Tingkat Empati"
        value={data.empathy}
        onChange={(v) => setData({ ...data, empathy: v })}
        labels={empathyLabels}
      />

      <View style={{ marginTop: 10, marginBottom: 30 }}>
        <AppButton 
          title="Simpan Aktivitas" 
          variant="success" 
          onPress={handleSave} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  valueLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10b981",
  },
  numericInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  numericInput: {
    width: 70,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  unitText: {
    fontSize: 14,
    color: "#64748b",
  },
  sliderContainer: {
    marginBottom: 25,
  },
  rangeIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: -5,
  },
  rangeText: {
    fontSize: 10,
    color: "#94a3b8",
  },
});