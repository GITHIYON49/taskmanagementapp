import { authAPI } from "../services/api";

export const saveAuthData = (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getAuthData = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr),
      };
    }
  } catch (error) {
    console.error("Error loading auth data:", error);
    clearAuthData();
  }

  return null;
};

export const verifyToken = async () => {
  try {
    const response = await authAPI.getMe();
    return response.data;
  } catch (error) {
    clearAuthData();
    return null;
  }
};
