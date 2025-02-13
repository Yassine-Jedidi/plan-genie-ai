const express = require("express");
const { supabase, getGoogleOAuthURL } = require("../config/supabase");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Set secure cookies
    res.cookie("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    if (session.refresh_token) {
      res.cookie("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.json({ user: session.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initiate Google OAuth
router.get("/google", async (req, res) => {
  try {
    const { data, error } = await getGoogleOAuthURL();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle OAuth callback
router.get("/callback/google", async (req, res) => {
  try {
    // The tokens will be in the hash fragment, so we'll redirect to the frontend
    // with a special route that will send the tokens back to our backend
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback${
      req.url.includes("#") ? "#" : ""
    }${req.url.split("#")[1] || ""}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Auth callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/sign-in?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
});

// New route to handle the token exchange
router.post("/callback/token-exchange", async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;

    if (!access_token) {
      throw new Error("No access token provided");
    }

    // Get user session using the access token
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.setSession({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    if (sessionError) throw sessionError;

    // Set secure cookies
    res.cookie("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    if (session.refresh_token) {
      res.cookie("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    // Store user data in session if needed
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(session.access_token);
    if (userError) throw userError;

    res.json({ success: true });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add this new route to get current user
router.get("/me", async (req, res) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    console.log("this is access_token", accessToken);
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
});

module.exports = router;
