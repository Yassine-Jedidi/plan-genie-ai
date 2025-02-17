const express = require("express");
const { supabase, getGoogleOAuthURL } = require("../config/supabase");
const fetch = require("node-fetch");

const router = express.Router();

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
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: "plan-genie-ai-backend.vercel.app",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      if (session.refresh_token) {
        res.cookie("sb-refresh-token", session.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          domain: "plan-genie-ai-backend.vercel.app",
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
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "plan-genie-ai-backend.vercel.app",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    if (session.refresh_token) {
      res.cookie("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: "plan-genie-ai-backend.vercel.app",
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
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "plan-genie-ai-backend.vercel.app",
      path: "/",
    });
    res.clearCookie("sb-refresh-token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "plan-genie-ai-backend.vercel.app",
      path: "/",
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
      secure: true,
      sameSite: "None",
      domain: "plan-genie-ai-backend.vercel.app",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    if (session.refresh_token) {
      res.cookie("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: "plan-genie-ai-backend.vercel.app",
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
