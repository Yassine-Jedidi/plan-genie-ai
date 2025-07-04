const { supabase, getGoogleOAuthURL } = require("../config/supabase");
const fetch = require("node-fetch");
const prisma = require("../config/prisma");
const path = require("path");
const crypto = require("crypto");

// Helper function to get cookie options
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

class AuthService {
  getCookieOptions(req) {
    return getCookieOptions(req);
  }

  async verifyTurnstileToken(token) {
    return await verifyTurnstileToken(token);
  }

  async signUp(email, password, turnstileToken) {
    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      throw new Error("Invalid Turnstile token");
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

    return data;
  }

  async signIn(email, password, turnstileToken) {
    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      throw new Error("Invalid Turnstile token");
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

    return { session, user: updatedUser };
  }

  async signOut(accessToken) {
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
  }

  async getGoogleOAuthURL() {
    const { data, error } = await getGoogleOAuthURL();
    if (error) throw error;
    return data;
  }

  async handleTokenExchange(tokens) {
    const {
      access_token,
      refresh_token,
      expires_in,
      provider_token,
      provider_refresh_token,
    } = tokens;

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

    return { session, user: updatedUser };
  }

  async getCurrentUser(accessToken) {
    if (!accessToken) {
      throw new Error("Not authenticated");
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

    return mergedUser;
  }

  async refreshTokenIfNeeded(accessToken, refreshToken) {
    if (!refreshToken || !accessToken) {
      return null;
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

      return session;
    }

    return null;
  }

  async resetPassword(email, turnstileToken) {
    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      throw new Error("Invalid Turnstile token");
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) throw error;

    return data;
  }

  async updatePassword(password, accessToken, refreshToken) {
    if (!password) {
      throw new Error("Password is required");
    }

    if (!accessToken) {
      throw new Error("Access token is required");
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

    return data;
  }

  async uploadAvatar(file, accessToken) {
    if (!file) {
      throw new Error("No file uploaded");
    }

    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    // Get user info
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    if (userError) throw userError;

    const user = userData.user;
    if (!user) {
      throw new Error("User not found");
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = `${user.id}-${crypto
      .randomBytes(16)
      .toString("hex")}${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
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

    return {
      avatar_url: publicUrlData.publicUrl,
      file_path: fileName,
    };
  }

  async updateProfile(data, accessToken) {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    if (!data || !data.full_name) {
      throw new Error("Full name is required");
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    if (userError) throw userError;

    const user = userData.user;
    if (!user) {
      throw new Error("User not found");
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

    return updatedUser.user;
  }

  async updateTheme(theme, colorTheme, accessToken) {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    if (!theme && !colorTheme) {
      throw new Error("Theme or colorTheme is required");
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    if (userError) throw userError;

    const user = userData.user;
    if (!user) {
      throw new Error("User not found");
    }

    // Update theme settings in Prisma database
    const updateData = {};
    if (theme) updateData.theme = theme;
    if (colorTheme) updateData.colorTheme = colorTheme;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return {
      theme: updatedUser.theme,
      colorTheme: updatedUser.colorTheme,
    };
  }
}

module.exports = new AuthService();
