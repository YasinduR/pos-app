export const logout = () => {
    localStorage.removeItem("adminData"); // remove user data
    localStorage.removeItem("accessToken"); // remove tokens
    localStorage.removeItem("refreshToken");
    window.location.href = "/"; // Redirect to login page
  };