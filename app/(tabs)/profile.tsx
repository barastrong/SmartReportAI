import { ProfileForm } from "@/components/profileform";
import { AppButton } from "@/components/ui/appbutton";
import { apiClient } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera, LogOut } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("login");
        return;
      }
      await fetchUserProfile();
    } catch (err) {
      console.error("Auth check error:", err);
      navigation.replace("login");
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProfile();
      setUserPhoto(response.user.photo);
      setUserName(response.user.name);
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Kami membutuhkan izin galeri untuk mengubah foto profil.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Photo = `data:image/jpeg;base64,${result.assets[0].base64}`;

        // Optimistic update UI
        setUserPhoto(base64Photo);

        // Save to database (pass photo as third parameter)
        try {
          await apiClient.updateProfile(userName, undefined, base64Photo);
          Alert.alert("Berhasil", "Foto profil berhasil diperbarui!");
        } catch (err) {
          console.error("Error updating profile:", err);
          Alert.alert("Gagal", "Gagal memperbarui foto ke server.");
        }
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Terjadi kesalahan saat memilih gambar.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.replace("login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <View style={styles.avatarWrapper}>
              <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
                {userPhoto ? (
                  <Image
                    source={{ uri: userPhoto }}
                    style={styles.avatarCircle}
                  />
                ) : (
                  <View style={[styles.avatarCircle, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>
                      {getInitials(userName)}
                    </Text>
                  </View>
                )}

                {/* Ikon Edit / Kamera */}
                <View style={styles.cameraBadge}>
                  <Camera size={18} color="#ffffff" />
                </View>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.userNameText}>{userName || "User Name"}</Text>
          <Text style={styles.subtitle}>Kelola profil dan preferensi Anda</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Informasi Profil</Text>
          <ProfileForm onUpdate={fetchUserProfile} />
        </View>

        <AppButton title="Logout" variant="danger" onPress={handleLogout}>
          <LogOut size={18} color="#ef4444" style={{ marginRight: 8 }} />
        </AppButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 24 },
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#f1f5f9",
  },
  avatarPlaceholder: {
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#ffffff" },
  loaderContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: "#64748b" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 20,
  },
});

export default ProfileScreen;
