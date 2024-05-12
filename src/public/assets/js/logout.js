const logout = async () => {
  await fetch("http://localhost:3000/api/sessions/logout", { method: "get" });
  window.location.href = "/login";
};
