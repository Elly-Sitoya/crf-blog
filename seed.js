const mongoose = require("mongoose");
require("dotenv").config();
const Users = require("./models/user.js");
const Blog = require("./models/Blog.js");
const bcrypt = require("bcryptjs");

const url = process.env.MONGODB_URI;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const seedDatabase = async () => {
  try {
    if (!url) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    // Connect to MongoDB
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Users.deleteMany({});
    await Blog.deleteMany({});
    console.log("Cleared existing data");

    // Create a test user
    const hashedPassword = await bcrypt.hash("test123", 12);
    const testUser = new Users({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      profilePic:
        "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
      bio: "This is a test user for the blog platform",
    });

    const savedUser = await testUser.save();
    console.log("Test user created:", savedUser.username);
    console.log("User ID:", savedUser._id);

    // Create a test blog
    const d = new Date();
    const date =
      +d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();

    const testBlog = new Blog({
      title: "Welcome to My Blog Platform",
      authorid: savedUser._id.toString(),
      authorImage: savedUser.profilePic || "",
      authorName: savedUser.username,
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
      description:
        "<p>This is a sample blog post to get you started. You can edit or delete this post and create your own!</p><p>Happy blogging!</p>",
      category: "Technology",
      publishDate: date,
      readtime: "2 min read",
      likes: [],
    });

    const savedBlog = await testBlog.save();
    console.log("Test blog created:", savedBlog.title);
    console.log("Blog ID:", savedBlog._id);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nTest User Credentials:");
    console.log("Email: test@example.com");
    console.log("Password: test123");
    console.log("\nYou can now login with these credentials.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
