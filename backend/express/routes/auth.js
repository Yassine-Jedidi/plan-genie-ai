const express = require("express");
const { supabase, getGoogleOAuthURL } = require("../config/supabase");
const fetch = require("node-fetch");
const prisma = require("../config/prisma");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File is too large. Maximum size allowed is 2MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

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

      // Get user from Prisma to check for custom data
      if (session.user) {
        const prismaUser = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        // Check if we need to update Supabase metadata
        let needsUpdate = false;
        const updateData = {};

        // Check if avatar needs to be preserved
        if (
          prismaUser &&
          prismaUser.avatar_url &&
          prismaUser.avatar_url !== session.user.user_metadata?.avatar_url
        ) {
          updateData.avatar_url = prismaUser.avatar_url;
          needsUpdate = true;
        }

        // Check if full_name needs to be preserved
        if (
          prismaUser &&
          prismaUser.full_name &&
          prismaUser.full_name !== session.user.user_metadata?.full_name
        ) {
          updateData.full_name = prismaUser.full_name;
          needsUpdate = true;
        }

        // Update Supabase if needed
        if (needsUpdate) {
          await supabase.auth.updateUser({
            data: updateData,
          });
        }
      }

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

    // Create user in Prisma database with Supabase auth ID
    if (data.user) {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        },
      });
    }

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

    // Check Prisma for custom user data before setting cookies
    const prismaUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Determine if we need to update Supabase metadata
    let needsUpdate = false;
    const updateData = {};

    // If Prisma has a custom avatar, update the Supabase user_metadata
    if (prismaUser && prismaUser.avatar_url) {
      const currentAvatar = session.user.user_metadata?.avatar_url;

      // Only update if the avatars are different
      if (currentAvatar !== prismaUser.avatar_url) {
        updateData.avatar_url = prismaUser.avatar_url;
        needsUpdate = true;
      }
    }

    // If Prisma has a custom full_name, update the Supabase user_metadata
    if (prismaUser && prismaUser.full_name) {
      const currentFullName = session.user.user_metadata?.full_name;

      // Only update if the names are different
      if (currentFullName !== prismaUser.full_name) {
        updateData.full_name = prismaUser.full_name;
        needsUpdate = true;
      }
    }

    // Update Supabase if needed
    if (needsUpdate) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (updateError) {
        console.error("Failed to update Supabase user data:", updateError);
      }
    }

    // Get the updated user data after potential updates
    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser(session.access_token);

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

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signout", async (req, res) => {
  try {
    const accessToken = req.cookies["sb-access-token"];

    if (accessToken) {
      // Use the access token to sign out the specific session
      const { error } = await supabase.auth.signOut({
        scope: "local", // Only sign out from the current device
        accessToken: accessToken,
      });

      if (error) throw error;
    } else {
      // Fallback to global signout if no access token is available
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }

    // Clear auth cookies with appropriate options
    res.clearCookie("sb-access-token", getCookieOptions(req));
    res.clearCookie("sb-refresh-token", getCookieOptions(req));
    // Send successful response
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Sign out error:", error);
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

    // Check if user exists in Prisma database
    let prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const googleAvatarUrl =
      user.user_metadata.avatar_url || user.user_metadata.picture;
    const googleFullName =
      user.user_metadata.full_name ||
      user.user_metadata.name ||
      user.email.split("@")[0];

    if (!prismaUser) {
      // Create new user in Prisma if they don't exist
      prismaUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          full_name: googleFullName,
          avatar_url: googleAvatarUrl,
        },
      });
    }

    // Determine if we need to update Supabase data
    let needsUpdate = false;
    const updateData = {};

    // Check if avatar needs to be updated
    if (prismaUser.avatar_url && prismaUser.avatar_url !== googleAvatarUrl) {
      updateData.avatar_url = prismaUser.avatar_url;
      needsUpdate = true;
    } else if (!prismaUser.avatar_url) {
      // If no custom avatar in Prisma yet, update Prisma with Google's avatar
      await prisma.user.update({
        where: { id: user.id },
        data: {
          avatar_url: googleAvatarUrl,
        },
      });
    }

    // Check if full_name needs to be updated
    if (prismaUser.full_name && prismaUser.full_name !== googleFullName) {
      updateData.full_name = prismaUser.full_name;
      needsUpdate = true;
    } else if (!prismaUser.full_name) {
      // If no custom full_name in Prisma yet, update Prisma with Google's name
      await prisma.user.update({
        where: { id: user.id },
        data: {
          full_name: googleFullName,
        },
      });
    }

    // Update Supabase user_metadata if needed
    if (needsUpdate) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (updateError) {
        console.error("Failed to update Supabase user data:", updateError);
      }
    }

    // Get the updated user with corrected data
    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser(session.access_token);

    console.log("Token exchange successful");
    res.json({ user: updatedUser, success: true });
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

    // Also fetch the user from Prisma database to get the latest data
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // Create a merged user object, always prioritizing Prisma data
    const mergedUser = {
      ...user,
      // Always prioritize Prisma data over Supabase data
      avatar_url:
        prismaUser?.avatar_url ||
        user.avatar_url ||
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture,
      full_name:
        prismaUser?.full_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name,
    };

    // Add theme properties from Prisma to the user metadata
    if (prismaUser) {
      if (!mergedUser.user_metadata) {
        mergedUser.user_metadata = {};
      }

      if (prismaUser.theme) {
        mergedUser.user_metadata.theme = prismaUser.theme;
      }

      if (prismaUser.colorTheme) {
        mergedUser.user_metadata.colorTheme = prismaUser.colorTheme;
      }
    }

    res.json({ user: mergedUser });
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

// Route to upload avatar to Supabase storage
router.post(
  "/upload-avatar",
  upload.single("avatar"),
  handleMulterError,
  async (req, res) => {
    try {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Check authentication
      const accessToken = req.cookies["sb-access-token"];
      if (!accessToken) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Get user info
      const { data: userData, error: userError } = await supabase.auth.getUser(
        accessToken
      );
      if (userError) throw userError;

      const user = userData.user;
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate unique filename
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${user.id}-${crypto
        .randomBytes(16)
        .toString("hex")}${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update avatar in Prisma database
      await prisma.user.update({
        where: { id: user.id },
        data: { avatar_url: publicUrlData.publicUrl },
      });

      // Return the public URL
      res.json({
        avatar_url: publicUrlData.publicUrl,
        file_path: fileName,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        error: error.message || "Failed to upload avatar",
      });
    }
  }
);

// Add update profile route
router.put("/update-profile", handleMulterError, async (req, res) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { data } = req.body;
    if (!data || !data.full_name) {
      return res.status(400).json({ error: "Full name is required" });
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    if (userError) throw userError;

    const user = userData.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare metadata update
    const metadata = {
      full_name: data.full_name,
    };

    // Add avatar URL to metadata if provided
    if (data.avatar_url) {
      metadata.avatar_url = data.avatar_url;
    }

    // Update Supabase user metadata
    const { data: updatedUser, error: updateError } =
      await supabase.auth.updateUser({
        data: metadata,
      });

    if (updateError) throw updateError;

    // Update user in Prisma database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        full_name: data.full_name,
        avatar_url: data.avatar_url || undefined,
      },
    });

    res.json({ user: updatedUser.user });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update profile" });
  }
});

// Add update theme settings route
router.put("/update-theme", async (req, res) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { theme, colorTheme } = req.body;
    if (!theme && !colorTheme) {
      return res.status(400).json({ error: "Theme or colorTheme is required" });
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    if (userError) throw userError;

    const user = userData.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update theme settings in Prisma database
    const updateData = {};
    if (theme) updateData.theme = theme;
    if (colorTheme) updateData.colorTheme = colorTheme;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    res.json({
      success: true,
      theme: updatedUser.theme,
      colorTheme: updatedUser.colorTheme,
    });
  } catch (error) {
    console.error("Update theme error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update theme settings" });
  }
});

module.exports = router;
