const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend TPQ Menyala 🔥");
});

app.listen(3000, () => {
  console.log("Server backend jalan di http://localhost:3000");
});