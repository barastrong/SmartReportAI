import { apiClient } from "@/services/api";
import { Check, Mail, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ProfileFormProps {
  onUpdate?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onUpdate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [motto, setMotto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await apiClient.getProfile();
      setName(response.user.name);
      setEmail(response.user.email);
      setRole(response.user.role || "");
      setMotto(response.user.motto || "");
    } catch (err) {
      setError("Gagal mengambil data profil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await apiClient.updateProfile(name, motto);
      setSuccess("Profil berhasil diperbarui!");
      if (onUpdate) onUpdate();

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Gagal memperbarui profil");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    await fetchProfile();
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      {/* Name Input - Always Editable */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <View style={styles.inputWrapper}>
          <User size={20} color="#94a3b8" />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nama kamu"
            editable={!saving}
          />
        </View>
      </View>

      {/* Email Input - Read Only */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <Mail size={20} color="#94a3b8" />
          <Text style={[styles.input, styles.textValue, styles.disabledInput]}>
            {email}
          </Text>
        </View>
      </View>

      {/* Motto Input - Editable */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Deskripsi / Motto</Text>
        <View style={[styles.inputWrapper, styles.multilineInputWrapper]}>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={motto}
            onChangeText={setMotto}
            placeholder="Tuliskan deskripsi atau motto diri kamu"
            placeholderTextColor="#cbd5e1"
            editable={!saving}
            multiline={true}
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Save Button - Always Visible */}
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleSaveName}
        disabled={saving}
      >
        <Check size={18} color="#10b981" />
        <Text style={[styles.buttonText, styles.saveButtonText]}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", gap: 12 },

  // Input
  inputGroup: { width: "100%" },
  label: { fontSize: 13, fontWeight: "500", color: "#475569", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: "#1e293b" },
  textValue: { paddingVertical: 8 },
  disabledInput: { color: "#94a3b8" },
  multilineInputWrapper: {
    height: "auto",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingVertical: 8,
  },
  errorText: { color: "#ef4444", fontSize: 12, marginBottom: 4 },
  successText: {
    color: "#10b981",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },

  // Buttons
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#10b981",
  },
  buttonText: { fontSize: 13, fontWeight: "600", color: "#ffffff" },
  saveButtonText: { color: "#10b981" },
});
