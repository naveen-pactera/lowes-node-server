const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/transactions", require("./routes/api/transactions"));

app.get("/", (req, res) => {
  return res.send("Welcome to Lowes Shrinkage Detection platform");
});

app.listen(PORT, async () => {
  console.log(`server listening on port ${PORT}`);
});
