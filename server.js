import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// ---- PATH setup (for views/public) ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- MONGO CONNECTION ----
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ---- MODELS ----

// User: basic auth – email + passwordHash
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Link: URL, owner, clicks, expiry
const linkSchema = new mongoose.Schema(
  {
    shortCode: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clicks: { type: Number, default: 0 },
    expiry: { type: Date }, // optional
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

// ---- MIDDLEWARES ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Simple auth middleware (JWT)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer token"
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const [, token] = authHeader.split(" ");
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // store user id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------- AUTH ROUTES -------------------

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- URL ROUTES (PROTECTED) -------------------

// CREATE short URL  (Click counter = starts 0, Expiry optional)
app.post("/api/shorten", authMiddleware, async (req, res) => {
  try {
    const { url, shortCode, expiryDays } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });

    const finalShortCode =
      shortCode || crypto.randomBytes(4).toString("hex");

    const existing = await Link.findOne({ shortCode: finalShortCode });
    if (existing)
      return res
        .status(400)
        .json({ message: "Short code already exists, choose another" });

    let expiryDate = undefined;
    if (expiryDays && Number(expiryDays) > 0) {
      expiryDate = new Date(
        Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000
      );
    }

    const link = await Link.create({
      shortCode: finalShortCode,
      originalUrl: url,
      owner: req.userId,
      expiry: expiryDate,
      clicks: 0,
    });

    res.status(201).json({
      message: "Short URL created",
      shortCode: link.shortCode,
      fullShortUrl: `${req.protocol}://${req.get("host")}/${link.shortCode}`,
      expiry: link.expiry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all links of logged-in user
app.get("/api/links", authMiddleware, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE one link
app.delete("/api/links/:id", authMiddleware, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!link) return res.status(404).json({ message: "Link not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- REDIRECT ROUTE (PUBLIC) -------------------

// NOTE: આ route auth વગર – કોઈ પણ short URL ખોલી શકે
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).send("Short URL not found");
    }

    // Expiry check
    if (link.expiry && link.expiry < new Date()) {
      return res.status(410).send("This short URL has expired");
    }

    // Click counter ++
    link.clicks += 1;
    await link.save();

    // Actual redirect
    res.redirect(link.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ------------------- SIMPLE HOME PAGE -------------------

// જૂનો index.html serve કરવા માટે (optional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
