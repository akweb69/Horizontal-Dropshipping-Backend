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
  const banners = await db
    .collection("heroSectionBanner")
    .find()
    .sort({ _id: -1 })
    .toArray();
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
  const items = await db
    .collection("featuredItems")
    .find()
    .sort({ _id: -1 })
    .toArray();
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
  const productData1 = {
    ...productData,
    createdAt: new Date(),
    totalSell: 0,
    rating: 0,
  };
  const result = await db.collection("products").insertOne(productData1);
  res.send(result);
});

app.get("/products", async (req, res) => {
  const products = await db
    .collection("products")
    .find()
    .sort({ _id: -1 })
    .toArray();
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
  const categories = await db
    .collection("categories")
    .find()
    .sort({ _id: -1 })
    .toArray();
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
  const tuki = {
    name: userData.name,
    date: userData.date,
  };
  if (userData.reference) {
    const qq = userData.reference;
    console.log(qq);
    const query = { reference: qq };
    const updateData = {
      $push: { myReferralUser: tuki },
    };
    console.log(updateData);
    const updating = await db.collection("users").updateOne(query, updateData);
    console.log("data updated", updating);
  }
  const result = await db.collection("users").insertOne(userData);
  res.send(result);
});

app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().sort({ _id: -1 }).toArray();
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
  const orders = await db
    .collection("orders")
    .find()
    .sort({ _id: -1 })
    .toArray();
  res.send(orders);
});
app.get("/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const order = await db
    .collection("orders")
    .findOne({ _id: new ObjectId(orderId) });
  if (!order) {
    return res.status(404).send({ error: "Order not found" });
  }
  res.send(order);
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
// ?-------------------Admin - user Management-------------------->
app.post("/users", async (req, res) => {
  try {
    const userData = req.body;

    const result = await db.collection("users").insertOne(userData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error" });
  }
});

app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().sort({ _id: -1 }).toArray();
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
// load user by email--->
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  res.send(user);
});
// ?-------------------Admin - user Management-------------------->
// ! -----------------wiselist----------------->
app.post("/wishlist", async (req, res) => {
  const wishData = req.body;
  const result = await db.collection("wishlist").insertOne(wishData);
  res.send(result);
});
app.get("/wishlist", async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query.email = email;
  }
  const wishlist = await db
    .collection("wishlist")
    .find(query)
    .sort({ _id: -1 })
    .toArray();
  res.send(wishlist);
});
app.delete("/wishlist/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("wishlist")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
// ! -----------------wiselist----------------->
// ! -----------------cart----------------->
app.post("/cart", async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!email || !productId) {
      return res.status(400).send({ error: "Invalid request data" });
    }
    console.log(productId, email);

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });
    console.log(product);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // Prevent duplicate entry
    const alreadyInCart = await db
      .collection("cart")
      .findOne({ email, _id: product._id });
    if (alreadyInCart) {
      return res.status(409).send({ message: "Already in cart" });
    }
    const { _id, ...productWithoutId } = product;
    const result = await db
      .collection("cart")
      .insertOne({ ...productWithoutId, email });
    res.send({ insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

app.get("/cart", async (req, res) => {
  const result = await db.collection("cart").find().sort({ _id: -1 }).toArray();
  res.send(result);
});
app.delete("/cart/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("cart")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
// ! -----------------cart----------------->

app.post("/love", async (req, res) => {
  try {
    const { productId, email } = req.body;
    if (!productId || !email) {
      return res.status(400).send({ error: "Invalid data" });
    }

    const query = { _id: new ObjectId(productId) };
    const product = await db.collection("products").findOne(query);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // check if already loved
    const exist = await db.collection("love").findOne({ email, productId });
    if (exist) {
      return res.send({ message: "Already in favorites" });
    }

    // remove _id and add new one
    const { _id, ...rest } = product;

    const data = {
      ...rest,
      productId,
      email,
      lovedAt: new Date(),
    };

    const result = await db.collection("love").insertOne(data);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

app.get("/love", async (req, res) => {
  const love = await db.collection("love").find().sort({ _id: -1 }).toArray();
  res.send(love);
});
app.delete("/love/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("love")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
// buy package api-------->
app.post("/buy-package", async (req, res) => {
  const packageData = req.body;
  const result = await db.collection("buyPackage").insertOne(packageData);
  res.send(result);
});
app.get("/buy-package", async (req, res) => {
  const packages = await db
    .collection("buyPackage")
    .find()
    .sort({ _id: -1 })
    .toArray();
  res.send(packages);
});
app.delete("/buy-package/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db
    .collection("buyPackage")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.patch("/buy-package/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.packageStatus;
    const email = req.body.email;
    const planName = req.body.planName;

    if (!id || !updatedData || !email) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    if (updatedData === "Approved") {
      const userQuery = { email };
      const user = await db.collection("users").findOne(userQuery);

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      await db.collection("users").updateOne(userQuery, {
        $set: {
          "subscription.plan": planName,
          isMember: true,
        },
      });
    }

    const result = await db
      .collection("buyPackage")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { packageStatus: updatedData } }
      );

    res.send({
      success: true,
      message: "Package status updated successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// buy product api-------->
app.post("/sell-product", async (req, res) => {
  const productData = req.body;
  const result = await db.collection("sellProduct").insertOne(productData);
  res.send(result);
});
app.get("/sell-product", async (req, res) => {
  const products = await db
    .collection("sellProduct")
    .find()
    .sort({ _id: -1 })
    .toArray();
  res.send(products);
});

// manage withdraw--->
app.post("/withdraw", async (req, res) => {
  const withdrawData = req.body;
  const result = await db.collection("withdraw").insertOne(withdrawData);
  res.send(result);
});
app.get("/withdraw", async (req, res) => {
  const withdraws = await db
    .collection("withdraw")
    .find()
    .sort({ _id: -1 })
    .toArray();
  res.send(withdraws);
});
app.patch("/withdraw/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.status;
    const email = req.body.email;
    const amount = req.body.amount;
    if (!id || !updatedData || !email) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    if (updatedData === "Approved") {
      const userQuery = { email };
      const user = await db.collection("users").findOne(userQuery);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      if (user.balance < amount) {
        return res.status(400).send({ error: "Insufficient balance" });
      }
      await db.collection("users").updateOne(userQuery, {
        $inc: { balance: -amount },
      });
    }
    const result = await db
      .collection("withdraw")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: updatedData } });
    res.send({
      success: true,
      message: "Withdraw status updated successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// manage withdraw--->
