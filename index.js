const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" })); // Restrict CORS in production
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oaguo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB Client Setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; // Global DB reference

// Run MongoDB connection
async function run() {
  try {
    await client.connect();
    db = client.db("Horizon");
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process if DB connection fails
  }
}

// Start server only after DB connection
async function startServer() {
  try {
    await run();
    app.listen(port, () => {
      console.log(
        `✅ Server is running on port ${port} --- Abu Kalam --- Alhamdulillah!`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Sample route
app.get("/", (req, res) => {
  res.send("✅ The server is running --- Horizon --- Alhamdulillah!");
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});

// all routes start from here---->
// !-------------------------------APIS---------------------------------->
// ?-------------------Admin - Homepage Management-------------------->
app.post("/hero-section-banner", async (req, res) => {
  const bannerData = req.body;
  const result = await db.collection("heroSectionBanner").insertOne(bannerData);
  res.send(result);
});

app.get("/hero-section-banner", async (req, res) => {
  const banners = await db.collection("heroSectionBanner").find().toArray();
  res.send(banners);
});
app.delete("/hero-section-banner/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("heroSectionBanner")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/hero-section-banner/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await db
    .collection("heroSectionBanner")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.send(result);
});
// featured items
app.post("/featured-items", async (req, res) => {
  const itemData = req.body;
  const result = await db.collection("featuredItems").insertOne(itemData);
  res.send(result);
});

app.get("/featured-items", async (req, res) => {
  const items = await db.collection("featuredItems").find().toArray();
  res.send(items);
});
app.delete("/featured-items/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("featuredItems")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/featured-items/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await db
    .collection("featuredItems")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.send(result);
});
// ?-------------------Admin - Homepage Management-------------------->
// !-------------------Admin - Product Management-------------------->
app.post("/products", async (req, res) => {
  const productData = req.body;
  const result = await db.collection("products").insertOne(productData);
  res.send(result);
});

app.get("/products", async (req, res) => {
  const products = await db.collection("products").find().toArray();
  res.send(products);
});
app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.send(result);
});
// !-------------------Admin - Product Management-------------------->
// ?-------------------Admin - Category Management-------------------->
app.post("/categories", async (req, res) => {
  const categoryData = req.body;
  const result = await db.collection("categories").insertOne(categoryData);
  res.send(result);
});

app.get("/categories", async (req, res) => {
  const categories = await db.collection("categories").find().toArray();
  res.send(categories);
});
app.delete("/categories/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("categories")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/categories/:id", async (req, res) => {
  const id = req.params.id;
  const { _id, ...updatedData } = req.body;
  try {
    const result = await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Category not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send({ error: "Failed to update category" });
  }
});
// ?-------------------Admin - Category Management-------------------->
// !-------------------Admin - User Management-------------------->
app.post("/users", async (req, res) => {
  const userData = req.body;
  const result = await db.collection("users").insertOne(userData);
  res.send(result);
});

app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.send(users);
});
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.send(result);
});
// !-------------------Admin - User Management-------------------->
// ?-------------------Admin - Order Management-------------------->
app.post("/orders", async (req, res) => {
  const orderData = req.body;
  const result = await db.collection("orders").insertOne(orderData);
  res.send(result);
});

app.get("/orders", async (req, res) => {
  const orders = await db.collection("orders").find().toArray();
  res.send(orders);
});
app.delete("/orders/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("orders")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/orders/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await db
    .collection("orders")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.send(result);
});
// ?-------------------Admin - Order Management-------------------->
