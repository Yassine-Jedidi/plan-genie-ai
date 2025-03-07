const express = require("express");
const { supabase, getGoogleOAuthURL } = require("../config/supabase");
const fetch = require("node-fetch");

const router = express.Router();

// Add CORS middleware for all routes
router.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === process.env.FRONTEND_URL) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// Handle OPTIONS requests for all routes
router.options("*", (req, res) => {
  res.sendStatus(200);
});

// Add this helper function at the top of the file after the router definition
const getCookieOptions = (req) => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    domain: isProduction ? "plan-genie-ai-backend.vercel.app" : undefined,
    path: "/",
  };
};

// Middleware to refresh token if needed
const refreshTokenIfNeeded = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["sb-refresh-token"];
    const accessToken = req.cookies["sb-access-token"];

    if (!refreshToken || !accessToken) {
      return next();
    }

    // Check if token is expired or about to expire (within 60 seconds)
    const { exp } = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64").toString()
    );
    const isExpired = Date.now() >= exp * 1000;
    const isAboutToExpire = Date.now() >= exp * 1000 - 60000; // 60 seconds before expiry

    if (isExpired || isAboutToExpire) {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) throw error;

      // Set new cookies
      res.cookie("sb-access-token", session.access_token, {
        ...getCookieOptions(req),
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      if (session.refresh_token) {
        res.cookie("sb-refresh-token", session.refresh_token, {
          ...getCookieOptions(req),
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
        });
      }
    }
  } catch (error) {
    console.error("Token refresh error:", error);
  }
  next();
};

// Apply the middleware to all routes that require authentication
router.use(["/me"], refreshTokenIfNeeded);

// Add a specific route for manual token refresh
router.post("/refresh", refreshTokenIfNeeded, async (req, res) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    if (!accessToken) {
      return res.status(401).json({ error: "No access token" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);
    if (error) throw error;

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: "Failed to refresh token" });
  }
});

// Verify Turnstile token
async function verifyTurnstileToken(token) {
  const formData = new URLSearchParams();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

router.post("/signup", async (req, res) => {
  try {
    const { email, password, turnstileToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!turnstileToken) {
      return res
        .status(400)
        .json({ error: "Turnstile verification is required" });
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return res.status(400).json({ error: "Invalid Turnstile token" });
    }

    // Extract full name from email (before @)
    const fullName = email.split("@")[0];

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password, turnstileToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!turnstileToken) {
      return res
        .status(400)
        .json({ error: "Turnstile verification is required" });
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return res.status(400).json({ error: "Invalid Turnstile token" });
    }

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
      ...getCookieOptions(req),
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    if (session.refresh_token) {
      res.cookie("sb-refresh-token", session.refresh_token, {
        ...getCookieOptions(req),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
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

    // Clear auth cookies
    res.clearCookie("sb-access-token", {
      ...getCookieOptions(req),
    });
    res.clearCookie("sb-refresh-token", {
      ...getCookieOptions(req),
    });

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
    const {
      access_token,
      refresh_token,
      expires_in,
      provider_token,
      provider_refresh_token,
    } = req.body;

    console.log("Received token exchange request");

    if (!access_token) {
      throw new Error("No access token provided");
    }

    // Get user session using the access token
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      console.error("Session error:", sessionError);
      throw sessionError;
    }

    // Set secure cookies
    res.cookie("sb-access-token", session.access_token, {
      ...getCookieOptions(req),
      maxAge: expires_in ? expires_in * 1000 : 60 * 60 * 1000,
    });

    if (session.refresh_token) {
      res.cookie("sb-refresh-token", session.refresh_token, {
        ...getCookieOptions(req),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    // Store user data in session if needed
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(session.access_token);

    if (userError) {
      console.error("User error:", userError);
      throw userError;
    }

    console.log("Token exchange successful");
    res.json({ user, success: true });
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

// Add password reset route
router.post("/reset-password", async (req, res) => {
  try {
    const { email, turnstileToken } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!turnstileToken) {
      return res
        .status(400)
        .json({ error: "Turnstile verification is required" });
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return res.status(400).json({ error: "Invalid Turnstile token" });
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) throw error;

    // Always return success to prevent email enumeration
    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    // Always return success to prevent email enumeration
    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  }
});

// Add update password route
router.post("/update-password", async (req, res) => {
  try {
    const { password, accessToken, refreshToken } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    // First, exchange the tokens for a session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || null,
      });

    if (sessionError) {
      console.error("Session error:", sessionError);
      throw sessionError;
    }

    // Now update the password using the established session
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    // Clear any existing session cookies
    res.clearCookie("sb-access-token", getCookieOptions(req));
    res.clearCookie("sb-refresh-token", getCookieOptions(req));

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update password" });
  }
});

module.exports = router;
