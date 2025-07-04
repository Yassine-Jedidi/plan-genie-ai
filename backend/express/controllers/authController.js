const authService = require("../services/authService");
const { supabase } = require("../config/supabase");

class AuthController {
  async signUp(req, res) {
    try {
      const { email, password, turnstileToken } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      if (!turnstileToken) {
        return res
          .status(400)
          .json({ error: "Turnstile verification is required" });
      }

      const data = await authService.signUp(email, password, turnstileToken);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password, turnstileToken } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      if (!turnstileToken) {
        return res
          .status(400)
          .json({ error: "Turnstile verification is required" });
      }

      const { session, user } = await authService.signIn(
        email,
        password,
        turnstileToken
      );

      // Set secure cookies
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

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async signOut(req, res) {
    try {
      const accessToken = req.cookies["sb-access-token"];
      await authService.signOut(accessToken);

      // Clear auth cookies with appropriate options
      res.clearCookie("sb-access-token", authService.getCookieOptions(req));
      res.clearCookie("sb-refresh-token", authService.getCookieOptions(req));

      res.json({ message: "Signed out successfully" });
    } catch (error) {
      console.error("Sign out error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getGoogleOAuthURL(req, res) {
    try {
      const data = await authService.getGoogleOAuthURL();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleOAuthCallback(req, res) {
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
  }

  async handleTokenExchange(req, res) {
    try {
      const {
        access_token,
        refresh_token,
        expires_in,
        provider_token,
        provider_refresh_token,
      } = req.body;

      console.log("Received token exchange request");

      const { session, user } = await authService.handleTokenExchange({
        access_token,
        refresh_token,
        expires_in,
        provider_token,
        provider_refresh_token,
      });

      // Set secure cookies
      res.cookie("sb-access-token", session.access_token, {
        ...authService.getCookieOptions(req),
        maxAge: expires_in ? expires_in * 1000 : 60 * 60 * 1000,
      });

      if (session.refresh_token) {
        res.cookie("sb-refresh-token", session.refresh_token, {
          ...authService.getCookieOptions(req),
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      console.log("Token exchange successful");
      res.json({ user, success: true });
    } catch (error) {
      console.error("Token exchange error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const accessToken = req.cookies["sb-access-token"];
      console.log("this is access_token", accessToken);

      const user = await authService.getCurrentUser(accessToken);
      res.json({ user });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(401).json({ error: "Authentication failed" });
    }
  }

  async refreshToken(req, res) {
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
  }

  async resetPassword(req, res) {
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

      await authService.resetPassword(email, turnstileToken);

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
  }

  async updatePassword(req, res) {
    try {
      const { password, accessToken, refreshToken } = req.body;

      await authService.updatePassword(password, accessToken, refreshToken);

      // Clear any existing session cookies
      res.clearCookie("sb-access-token", authService.getCookieOptions(req));
      res.clearCookie("sb-refresh-token", authService.getCookieOptions(req));

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to update password" });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const result = await authService.uploadAvatar(
        req.file,
        req.cookies["sb-access-token"]
      );
      res.json(result);
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        error: error.message || "Failed to upload avatar",
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { data } = req.body;
      const user = await authService.updateProfile(
        data,
        req.cookies["sb-access-token"]
      );
      res.json({ user });
    } catch (error) {
      console.error("Update profile error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to update profile" });
    }
  }

  async updateTheme(req, res) {
    try {
      const { theme, colorTheme } = req.body;
      const result = await authService.updateTheme(
        theme,
        colorTheme,
        req.cookies["sb-access-token"]
      );
      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Update theme error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to update theme settings" });
    }
  }
}

module.exports = new AuthController();
