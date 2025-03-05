export const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found"); // Handle missing token
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };