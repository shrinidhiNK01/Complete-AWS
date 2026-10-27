const express = require("express");
const path = require("path");

const app = express();

// 🔥 Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API route
app.get("/api/message", (req, res) => {
    res.json({ message: "🚀 Server is running perfectly on AWS EC2!" });
});

// Fallback (VERY IMPORTANT)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});