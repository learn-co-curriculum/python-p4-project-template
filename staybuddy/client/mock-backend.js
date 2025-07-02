const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Mock user database
const users = [
  {
    id: 1,
    username: "demo",
    email: "demo@example.com",
    password: "password123",
  },
];

// Mock stays database
const stays = [
  {
    id: 3,
    title: "Luxury Urban Apartment",
    description:
      "Modern apartment in the heart of the city with premium amenities and stunning contemporary design. Features spacious living areas, high-end furnishings, and breathtaking city views.",
    price: 18000,
    location: "Westlands, Nairobi",
    host_id: 1,
    photos: [
      {
        url: "https://images.pexels.com/photos/279607/pexels-photo-279607.jpeg",
        type: "url",
        name: "Modern Living Room",
      },
      {
        url: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
        type: "url",
        name: "Elegant Kitchen",
      },
    ],
  },
  {
    id: 4,
    title: "Serene Garden Villa",
    description:
      "Peaceful villa surrounded by lush gardens with beautifully designed interiors. Perfect for relaxation with cozy bedrooms, spa-like bathrooms, and warm gathering spaces.",
    price: 16000,
    location: "Karen, Nairobi",
    host_id: 1,
    photos: [
      {
        url: "https://images.pexels.com/photos/32795042/pexels-photo-32795042.jpeg",
        type: "url",
        name: "Cozy Bedroom",
      },
      {
        url: "https://images.pexels.com/photos/3288104/pexels-photo-3288104.png",
        type: "url",
        name: "Luxury Bathroom",
      },
    ],
  },
  {
    id: 5,
    title: "Elegant Family Home",
    description:
      "Spacious family home with charming vintage touches and modern comforts. Features elegant dining areas, comfortable living spaces, and tasteful décor throughout.",
    price: 14000,
    location: "Muthaiga, Nairobi",
    host_id: 1,
    photos: [
      {
        url: "https://images.pexels.com/photos/2317972/pexels-photo-2317972.jpeg",
        type: "url",
        name: "Vintage Dining Room",
      },
      {
        url: "https://images.pexels.com/photos/6667210/pexels-photo-6667210.jpeg",
        type: "url",
        name: "Cozy Fireplace Area",
      },
    ],
  },
  {
    id: 6,
    title: "Modern Minimalist Retreat",
    description:
      "Clean, contemporary design meets comfort in this stunning minimalist home. Features bright open spaces, neutral tones, and carefully curated furnishings for the perfect peaceful getaway.",
    price: 17000,
    location: "Runda, Nairobi",
    host_id: 1,
    photos: [
      {
        url: "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg",
        type: "url",
        name: "Minimalist Bedroom",
      },
      {
        url: "https://images.pexels.com/photos/279607/pexels-photo-279607.jpeg",
        type: "url",
        name: "Contemporary Living Space",
      },
    ],
  },
  {
    id: 7,
    title: "Stylish Executive Suite",
    description:
      "Upscale accommodation perfect for business travelers and discerning guests. Features designer interiors, premium amenities, and sophisticated styling throughout every room.",
    price: 20000,
    location: "Kilimani, Nairobi",
    host_id: 1,
    photos: [
      {
        url: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
        type: "url",
        name: "Designer Kitchen",
      },
      {
        url: "https://images.pexels.com/photos/3288104/pexels-photo-3288104.png",
        type: "url",
        name: "Executive Bathroom",
      },
    ],
  },
];

// Auth endpoints
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  console.log(`Login attempt: ${email}`);

  // Find user
  const user = users.find((u) => u.email === email);

  if (user && user.password === password) {
    console.log(`Login successful for: ${email}`);
    res.json({
      token: "mock-jwt-token-" + Date.now(),
      user: { id: user.id, username: user.username, email: user.email },
    });
  } else {
    console.log(
      `Login failed for: ${email} - ${user ? "Wrong password" : "User not found"}`,
    );
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/auth/signup", (req, res) => {
  const { username, email, password, phone } = req.body;

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
    phone,
  };

  users.push(newUser);

  res.json({
    token: "mock-jwt-token-" + Date.now(),
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
});

app.get("/auth/check_session", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    res.json({ user: { id: 1, username: "demo", email: "demo@example.com" } });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Stays endpoints
app.get("/stays", (req, res) => {
  res.json(stays);
});

app.get("/stays/:id", (req, res) => {
  const stay = stays.find((s) => s.id === parseInt(req.params.id));
  if (stay) {
    res.json(stay);
  } else {
    res.status(404).json({ error: "Stay not found" });
  }
});

app.post("/stays", (req, res) => {
  const {
    title,
    description,
    location,
    price,
    contact_phone,
    photos = [],
  } = req.body;

  if (!title || !location || !price) {
    return res
      .status(400)
      .json({ error: "Title, location, and price are required" });
  }

  const newStay = {
    id: stays.length + 1,
    title,
    description: description || "",
    location,
    price: parseFloat(price),
    contact_phone: contact_phone || "",
    host_id: 1, // Mock user ID
    photos: photos || [],
    created_at: new Date().toISOString(),
  };

  stays.push(newStay);

  console.log(`New stay created: ${title} with ${photos.length} photos`);

  res.status(201).json(newStay);
});

app.patch("/stays/:id", (req, res) => {
  const stayId = parseInt(req.params.id);
  const stay = stays.find((s) => s.id === stayId);

  if (!stay) {
    return res.status(404).json({ error: "Stay not found" });
  }

  // In a real app, you'd check if user owns this stay
  // For mock, we'll allow any update

  const { title, description, location, price, contact_phone, photos } =
    req.body;

  if (title) stay.title = title;
  if (description !== undefined) stay.description = description;
  if (location) stay.location = location;
  if (price) stay.price = parseFloat(price);
  if (contact_phone !== undefined) stay.contact_phone = contact_phone;
  if (photos) stay.photos = photos;

  console.log(`Stay ${stayId} updated: ${stay.title}`);

  res.json(stay);
});

app.delete("/stays/:id", (req, res) => {
  const stayId = parseInt(req.params.id);
  const index = stays.findIndex((s) => s.id === stayId);

  if (index === -1) {
    return res.status(404).json({ error: "Stay not found" });
  }

  // In a real app, you'd check if user owns this stay
  // For mock, we'll allow any deletion

  stays.splice(index, 1);
  console.log(`Stay ${stayId} deleted`);

  res.json({ message: "Stay deleted successfully" });
});

// Bookings endpoints
app.post("/bookings", (req, res) => {
  res.json({ id: 1, ...req.body, status: "confirmed" });
});

app.get("/bookings", (req, res) => {
  res.json([
    {
      id: 1,
      stay_id: 1,
      check_in: "2024-01-15",
      check_out: "2024-01-20",
      status: "confirmed",
    },
  ]);
});

// Mock reviews database
const reviews = [
  {
    id: 1,
    stay_id: 1,
    user_id: 1,
    rating: 5,
    comment:
      "Amazing place! The beach view was incredible and the host was very responsive.",
    created_at: new Date().toISOString(),
    author: { id: 1, username: "demo", email: "demo@example.com" },
  },
  {
    id: 2,
    stay_id: 1,
    user_id: 2,
    rating: 4,
    comment:
      "Great location and clean facilities. Would definitely stay again!",
    created_at: new Date().toISOString(),
    author: { id: 2, username: "traveler", email: "traveler@example.com" },
  },
];

// Mock favorites database
const favorites = [];

// Reviews endpoints
app.get("/reviews/stay/:stayId", (req, res) => {
  const stayId = parseInt(req.params.stayId);
  const stayReviews = reviews.filter((r) => r.stay_id === stayId);
  res.json(stayReviews);
});

app.post("/reviews", (req, res) => {
  const { stay_id, rating, comment } = req.body;

  if (!stay_id || !rating || !comment) {
    return res
      .status(400)
      .json({ error: "Stay ID, rating, and comment are required" });
  }

  const newReview = {
    id: reviews.length + 1,
    stay_id: parseInt(stay_id),
    user_id: 1, // Mock user ID
    rating: parseInt(rating),
    comment,
    created_at: new Date().toISOString(),
    author: { id: 1, username: "demo", email: "demo@example.com" },
  };

  reviews.push(newReview);
  console.log(`New review created for stay ${stay_id}: ${rating} stars`);

  res.status(201).json(newReview);
});

// Favorites endpoints
app.get("/favorites", (req, res) => {
  // Return favorites with stay details
  const userFavorites = favorites.map((fav) => ({
    ...fav,
    stay: stays.find((s) => s.id === fav.stay_id),
  }));
  res.json(userFavorites);
});

app.post("/favorites", (req, res) => {
  const { stay_id, notes } = req.body;

  if (!stay_id) {
    return res.status(400).json({ error: "Stay ID is required" });
  }

  // Check if already favorited
  const existing = favorites.find(
    (f) => f.stay_id === parseInt(stay_id) && f.user_id === 1,
  );
  if (existing) {
    return res.status(400).json({ error: "Stay already in favorites" });
  }

  const newFavorite = {
    id: favorites.length + 1,
    user_id: 1, // Mock user ID
    stay_id: parseInt(stay_id),
    notes: notes || "",
    date_added: new Date().toISOString(),
  };

  favorites.push(newFavorite);
  console.log(`Stay ${stay_id} added to favorites`);

  res.status(201).json(newFavorite);
});

app.get("/favorites/check/:stayId", (req, res) => {
  const stayId = parseInt(req.params.stayId);
  const favorite = favorites.find(
    (f) => f.stay_id === stayId && f.user_id === 1,
  );

  res.json({
    is_favorited: !!favorite,
    favorite_id: favorite?.id || null,
    notes: favorite?.notes || null,
  });
});

app.patch("/favorites/:favoriteId", (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  const { notes } = req.body;

  const favorite = favorites.find((f) => f.id === favoriteId);
  if (!favorite) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  favorite.notes = notes;
  console.log(`Favorite ${favoriteId} notes updated`);

  res.json(favorite);
});

app.delete("/favorites/:favoriteId", (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  const index = favorites.findIndex((f) => f.id === favoriteId);

  if (index === -1) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  favorites.splice(index, 1);
  console.log(`Favorite ${favoriteId} removed`);

  res.json({ message: "Favorite removed successfully" });
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Mock StayBuddy Backend Server Running", status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const PORT = process.env.BACKEND_PORT || 5001;

const server = app
  .listen(PORT, () => {
    console.log(`Mock backend server running on http://localhost:${PORT}`);
    console.log("Available endpoints:");
    console.log("  POST /auth/login");
    console.log("  POST /auth/signup");
    console.log("  GET /auth/check_session");
    console.log("  GET /stays");
    console.log("  GET /stays/:id");
    console.log("  POST /stays");
    console.log("  PATCH /stays/:id");
    console.log("  DELETE /stays/:id");
    console.log("  POST /bookings");
    console.log("  GET /bookings");
    console.log("  GET /reviews/stay/:stayId");
    console.log("  POST /reviews");
    console.log("  GET /favorites");
    console.log("  POST /favorites");
    console.log("  GET /favorites/check/:stayId");
    console.log("  PATCH /favorites/:favoriteId");
    console.log("  DELETE /favorites/:favoriteId");
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Trying port ${PORT + 1}...`,
      );
      server.listen(PORT + 1, () => {
        console.log(
          `Mock backend server running on http://localhost:${PORT + 1}`,
        );
      });
    } else {
      console.error("Server error:", err);
    }
  });

// Keep the server running
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully.");
  server.close(() => {
    console.log("Process terminated.");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully.");
  server.close(() => {
    console.log("Process terminated.");
  });
});
