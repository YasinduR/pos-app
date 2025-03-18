import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const getAuthConfig = async () => {
  // Function to handle token refresh
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log("refreshing",refreshToken)
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(`${baseURL}/admin/refresh`, { refreshToken:refreshToken });
      console.log('token refreshed',response.data)
      const { accessToken} = response.data;

      // Store acces token
      localStorage.setItem("accessToken", accessToken);
      console.log(accessToken)

      return accessToken; // Return the new access token for use
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error; // Propagate error to be handled by the calling function
    }
  };

  let token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No token found");
  }

  // Check if token is expired by decoding the JWT and checking the expiry timestamp
  const isTokenExpired = () => {
    const expiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;
    return Date.now() >= expiry;
  };
  
  // If token is expired, refresh it
  if (isTokenExpired()) {
    try {
      token = await refreshAccessToken(); // Refresh the token if expired
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }
  else{
    console.log("Token is valid")
  }

  // Return the auth config with the (possibly refreshed) token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};