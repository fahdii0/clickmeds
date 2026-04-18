import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isVercel = Boolean(process.env.VERCEL);
const PORT = 3000;

export default app;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database routes will fail until it is configured.");
} else {
  console.log("Attempting to connect to MongoDB...");
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// Schemas
const brandingSchema = new mongoose.Schema({
  name: String,
  accentTitle: String,
  tagline: String,
  primaryColor: String,
  secondaryColor: String
});

const productSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  name: String,
  price: Number,
  rating: Number,
  type: String,
  category: String,
  description: String,
  image: String,
  iconName: String
});

const facilitySchema = new mongoose.Schema({
  name: String,
  specialists: String,
  distance: String,
  address: String,
  timing: String,
  type: { type: String, enum: ['hospital', 'store'] }
});

const orderSchema = new mongoose.Schema({
  orderId: String,
  items: Array,
  total: Number,
  customer: {
    name: String,
    address: String,
    phone: String
  },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const donorSchema = new mongoose.Schema({
  name: String,
  bloodType: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const Branding = mongoose.model("Branding", brandingSchema);
const Product = mongoose.model("Product", productSchema);
const Facility = mongoose.model("Facility", facilitySchema);
const Order = mongoose.model("Order", orderSchema);
const Donor = mongoose.model("Donor", donorSchema);

// API Routes
app.get("/api/db-status", (req, res) => {
  const state = mongoose.connection.readyState;
  const stateLabel =
    state === 1 ? "Connected" :
    state === 2 ? "Connecting" :
    state === 3 ? "Disconnecting" :
    "Disconnected";

  res.json({ 
    connected: state === 1,
    status: MONGODB_URI ? stateLabel : "Missing MONGODB_URI"
  });
});

app.get("/api/branding", async (req, res) => {
  try {
    const branding = await Branding.findOne() || {
      name: "Click",
      accentTitle: "Meds",
      tagline: "From Trusted Shelves to Your Doorstep",
      primaryColor: "#1a2b4b",
      secondaryColor: "#3eb489"
    };
    res.json(branding);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch branding" });
  }
});

app.put("/api/branding", async (req, res) => {
  try {
    const branding = await Branding.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(branding);
  } catch (error) {
    res.status(500).json({ error: "Failed to update branding" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.put("/api/products", async (req, res) => {
  try {
    const products = req.body;
    await Product.deleteMany({});
    const result = await Product.insertMany(products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update products" });
  }
});

app.get("/api/facilities", async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json({
      hospitals: facilities.filter(f => f.type === 'hospital'),
      stores: facilities.filter(f => f.type === 'store')
    });
  } catch (error) {
    console.error("Failed to fetch facilities:", error);
    // Keep frontend functional even if DB is temporarily unavailable.
    res.json({ hospitals: [], stores: [] });
  }
});

app.put("/api/facilities", async (req, res) => {
  try {
    const { hospitals, stores } = req.body;
    await Facility.deleteMany({});
    const hospitalData = hospitals.map((h: any) => ({ ...h, type: 'hospital' }));
    const storeData = stores.map((s: any) => ({ ...s, type: 'store' }));
    const result = await Facility.insertMany([...hospitalData, ...storeData]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update facilities" });
  }
});

// Orders & Donors
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.post("/api/donors", async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.json(donor);
  } catch (error) {
    res.status(500).json({ error: "Failed to register donor" });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    const donorCount = await Donor.countDocuments();
    const productCount = await Product.countDocuments();
    res.json({ orderCount, donorCount, productCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Seed Data Route
app.put("/api/seed", async (req, res) => {
  try {
    const { branding, products, hospitals, stores } = req.body;
    
    await Branding.deleteMany({});
    await Branding.create(branding);
    
    await Product.deleteMany({});
    await Product.insertMany(products);
    
    await Facility.deleteMany({});
    const fData = [
      ...hospitals.map((h: any) => ({ ...h, type: 'hospital' })),
      ...stores.map((s: any) => ({ ...s, type: 'store' }))
    ];
    await Facility.insertMany(fData);
    
    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed database" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`🚀 ClickMeds Full-Stack Server running on http://0.0.0.0:${PORT}`);
    console.log(`Health check available at http://0.0.0.0:${PORT}/api/health`);
  });
}

if (!isVercel) {
  startServer();
}
