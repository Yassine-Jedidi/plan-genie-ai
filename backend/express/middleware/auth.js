const { supabase } = require("../config/supabase");

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies["sb-access-token"];

    if (!accessToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticateUser };
