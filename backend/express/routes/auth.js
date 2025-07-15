const express = require("express");
const multer = require("multer");
const authController = require("../controllers/authController");
const authService = require("../services/authService");

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

// Middleware to refresh token if needed
const refreshTokenIfNeeded = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["sb-refresh-token"];
    const accessToken = req.cookies["sb-access-token"];

    const session = await authService.refreshTokenIfNeeded(
      accessToken,
      refreshToken
    );

    if (session) {
      // Set new cookies
      res.cookie("sb-access-token", session.access_token, {
        ...authService.getCookieOptions(req),
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      if (session.refresh_token) {
        res.cookie("sb-refresh-token", session.refresh_token, {
          ...authService.getCookieOptions(req),
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
        });
      }
    }
  } catch (error) {
    console.error("Token refresh error:", error);
  }
  next();
};

router.use(refreshTokenIfNeeded);

// Public routes (no refresh needed)
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/google", authController.getGoogleOAuthURL);
router.get("/callback/google", authController.handleOAuthCallback);
router.post("/callback/token-exchange", authController.handleTokenExchange);
router.post("/reset-password", authController.resetPassword);
router.post("/update-password", authController.updatePassword);

// Protected routes (will trigger refresh if needed)
router.post("/signout", authController.signOut);
router.get("/me", authController.getCurrentUser);
router.post("/refresh", authController.refreshToken);
router.post(
  "/upload-avatar",
  upload.single("avatar"),
  handleMulterError,
  authController.uploadAvatar
);
router.put("/update-profile", handleMulterError, authController.updateProfile);
router.put("/update-theme", authController.updateTheme);

module.exports = router;
