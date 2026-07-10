import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

interface DBUser {
  username: string;
  email: string;
  salt: string;
  hash: string;
  isVerified: boolean;
  verificationCode: string;
  resetCode?: string;
  tier: 'standard' | 'premium';
  avatarSeed: string;
  accentColor: string;
  bgGradientStyle: 'soft-grey' | 'metallic' | 'dark-platinum' | 'stardust';
  securityNotifications?: boolean;
}

// In-memory data store for demonstration persistence
const users: Record<string, DBUser> = {};
const sessions: Record<string, string> = {}; // token -> email

// Helper function to hash password
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Seed default operator user for immediate login testing
  const defaultSalt = crypto.randomBytes(16).toString("hex");
  users["operator@utubemail.com"] = {
    username: "Sovereign Operator",
    email: "operator@utubemail.com",
    salt: defaultSalt,
    hash: hashPassword("commandnexus", defaultSalt),
    isVerified: true,
    verificationCode: "000000",
    tier: "premium",
    avatarSeed: "nexus-operator-seed-982",
    accentColor: "#d35400",
    bgGradientStyle: "soft-grey",
    securityNotifications: true
  };

  // --- API Authentication Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "UTube Mail Cryptographic Auth Engine Online" });
  });

  // Registration
  app.post("/api/auth/register", (req, res) => {
    const { username, email, password, tier = "standard" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }

    const emailLower = email.toLowerCase().trim();
    if (users[emailLower]) {
      return res.status(400).json({ error: "A node with this email handle already exists." });
    }

    // Generate salt & hash
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);

    // Generate 6-digit email verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store user as pending verification
    users[emailLower] = {
      username: username.trim(),
      email: emailLower,
      salt,
      hash,
      isVerified: false,
      verificationCode,
      tier: tier === "premium" ? "premium" : "standard",
      avatarSeed: `nexus-${username.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(100 + Math.random() * 900)}`,
      accentColor: "#d35400",
      bgGradientStyle: "soft-grey",
      securityNotifications: true
    };

    // Return successfully with code (to simulate receiving email in user interface)
    res.json({
      success: true,
      message: "Node registration pending verification.",
      email: emailLower,
      verificationCode // Exposing verification code in response so front-end can display it nicely for user simulation
    });
  });

  // Resend Verification Code
  app.post("/api/auth/resend", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email handle is required." });

    const emailLower = email.toLowerCase().trim();
    const user = users[emailLower];
    if (!user) return res.status(404).json({ error: "Node not found." });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;

    res.json({
      success: true,
      message: "New verification code dispatched to node.",
      verificationCode: newCode
    });
  });

  // Verify Code
  app.post("/api/auth/verify", (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email handle and verification code are required." });
    }

    const emailLower = email.toLowerCase().trim();
    const user = users[emailLower];

    if (!user) {
      return res.status(404).json({ error: "Node registered not found." });
    }

    if (user.verificationCode !== code.trim()) {
      return res.status(400).json({ error: "Invalid verification code. Handshake failed." });
    }

    // Mark user as verified
    user.isVerified = true;
    res.json({
      success: true,
      message: "Cryptographic identity verified. Node handshakes armed."
    });
  });

  // Sign In
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email handle and passkey are required." });
    }

    const emailLower = email.toLowerCase().trim();
    const user = users[emailLower];

    if (!user) {
      return res.status(401).json({ error: "Access Denied. Node credentials not found." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Node verification required. Please verify your email first.",
        pendingVerification: true,
        email: emailLower
      });
    }

    // Hash & Verify
    const loginHash = hashPassword(password, user.salt);
    if (loginHash !== user.hash) {
      return res.status(401).json({ error: "Access Denied. Signature mismatch." });
    }

    // Generate Session Token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    sessions[sessionToken] = emailLower;

    res.json({
      success: true,
      message: "Security handshake complete.",
      sessionToken,
      user: {
        username: user.username,
        email: user.email,
        tier: user.tier,
        avatarSeed: user.avatarSeed,
        accentColor: user.accentColor,
        bgGradientStyle: user.bgGradientStyle,
        securityNotifications: user.securityNotifications !== false
      }
    });
  });

  // Forgot Password Email Simulation
  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email handle is required." });
    }

    const emailLower = email.toLowerCase().trim();
    const user = users[emailLower];

    if (!user) {
      return res.status(404).json({ error: "Access Denied. Node operator email not found." });
    }

    // Generate 6-digit cryptographic recovery code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;

    res.json({
      success: true,
      message: "Simulation recovery email sent.",
      email: emailLower,
      recoveryCode: resetCode
    });
  });

  // Reset Password Flow
  app.post("/api/auth/reset-password", (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, security code, and new passkey are required." });
    }

    const emailLower = email.toLowerCase().trim();
    const user = users[emailLower];

    if (!user) {
      return res.status(404).json({ error: "Node operator credentials not found." });
    }

    if (!user.resetCode || user.resetCode !== code.trim()) {
      return res.status(400).json({ error: "Invalid signature verification code. Password reset aborted." });
    }

    // Generate new salt and hash for the password
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newHash = hashPassword(newPassword, newSalt);

    user.salt = newSalt;
    user.hash = newHash;
    user.isVerified = true; // Auto-verify on successful recovery reset
    delete user.resetCode;

    res.json({
      success: true,
      message: "Passkey signature updated successfully. Cryptographic secure reset complete."
    });
  });

  // Check Current Session
  app.get("/api/auth/session", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const email = sessions[token];

    if (!email || !users[email]) {
      return res.status(401).json({ error: "Unauthorized. Session expired or invalid." });
    }

    const user = users[email];
    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        tier: user.tier,
        avatarSeed: user.avatarSeed,
        accentColor: user.accentColor,
        bgGradientStyle: user.bgGradientStyle,
        securityNotifications: user.securityNotifications !== false
      }
    });
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      delete sessions[token];
    }
    res.json({ success: true, message: "Session token invalidated." });
  });

  // Update profile settings
  app.post("/api/auth/profile/update", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const token = authHeader.split(" ")[1];
    const email = sessions[token];

    if (!email || !users[email]) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const user = users[email];
    const { username, accentColor, bgGradientStyle, tier, securityNotifications } = req.body;

    if (username) user.username = username;
    if (accentColor) user.accentColor = accentColor;
    if (bgGradientStyle) user.bgGradientStyle = bgGradientStyle;
    if (tier === "premium" || tier === "standard") user.tier = tier;
    if (securityNotifications !== undefined) user.securityNotifications = securityNotifications;

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        tier: user.tier,
        avatarSeed: user.avatarSeed,
        accentColor: user.accentColor,
        bgGradientStyle: user.bgGradientStyle,
        securityNotifications: user.securityNotifications !== false
      }
    });
  });

  // --- Vite Dev Server Middleware or Static Production Build ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
