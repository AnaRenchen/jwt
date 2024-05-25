export const authPost = (req, res, next) => {
  if (!req.user) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `You are not authenticated.` });
  }

  next();
};
