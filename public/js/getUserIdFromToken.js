function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found in localStorage.");
    return null;
  }

  try {
    // Decodes the payload of the token
    const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Base64 decode
    return tokenPayload.userId || null; // Returns userId if it exists
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
