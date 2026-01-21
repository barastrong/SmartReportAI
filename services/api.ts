import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://10.0.2.2:5000/api";

export const apiClient = {
  async getProfile() {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("📍 Token:", token?.substring(0, 20) + "...");
      console.log("🔗 Fetching from:", `${API_BASE_URL}/auth/profile`);

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📨 Response status:", response.status);
      console.log("📨 Response ok:", response.ok);

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (!response.ok) {
        console.error("❌ Error response:", data);
        throw new Error(data.message || "Failed to fetch profile");
      }

      return data;
    } catch (error: any) {
      console.error("❌ Get profile error:", error.message);
      console.error("❌ Full error:", error);
      throw error;
    }
  },

  async updateProfile(name: string, motto?: string, photo?: string) {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("🔄 Updating profile with name:", name);
      console.log("💭 Motto:", motto || "not provided");
      console.log("🔗 Sending to:", `${API_BASE_URL}/auth/profile`);

      const body: any = { name };
      if (motto !== undefined) {
        body.motto = motto;
      }
      if (photo) {
        body.photo = photo;
        console.log("📸 Photo included, size:", photo.length);
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log("📨 Update response status:", response.status);

      const data = await response.json();
      console.log("📥 Update response data:", data);

      if (!response.ok) {
        console.error("❌ Update error response:", data);
        throw new Error(data.message || "Failed to update profile");
      }

      return data;
    } catch (error: any) {
      console.error("❌ Update profile error:", error.message);
      console.error("❌ Full error:", error);
      throw error;
    }
  },
};
