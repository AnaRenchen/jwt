const logout = async () => {
  try {
    const response = await fetch("/api/sessions/logout", { method: "GET" });
    if (response.ok) {
      window.location.href = "/login";
    } else {
      console.error("Logout failed.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
