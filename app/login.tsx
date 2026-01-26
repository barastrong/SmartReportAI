import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity,  KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

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

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // For Android emulator, use 10.0.2.2 instead of localhost
  // For physical device, use your machine IP (e.g., 192.168.x.x)
  const API_URL = "http://10.0.2.2:5000";

    const handleLogin = async () => {
    console.log("🔑 Starting login...");

    if (!email || !password) {
      console.warn("❌ Validation failed: Email dan password harus diisi");
      alert("Email dan password harus diisi");
      return;
    }

    setLoading(true);
    console.log(`🚀 Sending login request to ${API_URL}/api/auth/login`);
    console.log("📤 Data:", { email, password });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("📨 Response status:", response.status);
      const data = await response.json();
      console.log("📥 Response data:", data);

      if (response.ok) {
        console.log("✅ Login successful!");
        console.log("💾 Saving token to AsyncStorage...");

        // Save token to AsyncStorage
        await AsyncStorage.setItem("authToken", data.token);
        console.log("✅ Token saved!");

        router.replace("/(tabs)");
      } else {
        console.error("❌ Login failed:", data.message);
        alert(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("🔴 Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error details:", errorMessage);
      alert("❌ Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Smart Report AI: Evaluasi cerdas untuk perkembangan hidup sehatmu.</Text>
          </View>

          <View>
            {/* Input Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={COLORS.primary} />
                <TextInput 
                   style={styles.input} 
                   placeholder="yourname@email.com" 
                   placeholderTextColor='#959ca5'
                   value={email}
                   onChangeText={setEmail}
                   keyboardType="email-address"
                   autoCapitalize="none"
                />
              </View>
            </View>

            {/* Input Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={COLORS.primary} />
                <TextInput 
                   style={styles.input} 
                   placeholder="••••••••" 
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={!showPassword}
                   placeholderTextColor='#959ca5'
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Tombol Login */}
            <TouchableOpacity style={styles.loginButton}  onPress={handleLogin} disabled={loading}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            {/* Footer Link */}
            <TouchableOpacity style={styles.registerLink} onPress={() => router.push("/register")}>
              <Text style={styles.footerText}>Don't have an account? <Text style={styles.link}>Register</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: "center", 
    padding: 28 
  },
  header: { 
    alignItems: "center", 
    marginBottom: 45 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "800",
    color: COLORS.textMain, 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    color: COLORS.textSecondary, 
    textAlign: "center", lineHeight: 24, 
    paddingHorizontal: 15 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: COLORS.textMain, 
    marginBottom: 8, 
    marginLeft: 4 
  },
  inputWrapper: {
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, 
    borderColor: COLORS.border, 
    borderRadius: 16,
    paddingHorizontal: 18, 
    height: 64,
  },
  input: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16, 
    color: COLORS.textMain 
  },
  loginButton: {
    backgroundColor: COLORS.primary, 
    height: 64, 
    borderRadius: 16,
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 15,
    elevation: 3, 
    shadowColor: COLORS.primary, 
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
  },
  loginText: { 
    color: "#FFFFFF", 
    fontSize: 18, 
    fontWeight: "700" 
  },
  registerLink: { 
    marginTop: 25, 
    alignItems: "center" 
  },
  footerText: { 
    fontSize: 15, 
    color: COLORS.textSecondary 
  },
  link: { 
    color: COLORS.primary, 
    fontWeight: "800" 
  },
});

export default Login;