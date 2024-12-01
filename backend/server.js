const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); 
const uploadRoutes = require("./routes/uploadRoutes");
const recordRoutes = require("./routes/recordRoutes");
const priceRangeRoutes = require("./routes/priceRangeRoutes");
const { errorHandler } = require("./middlewares/errorHandler"); 
const authRoutes = require("./routes/authRoutes"); 
const { Auth } = require("./controllers/authController");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json());


connectDB();


app.use("/api/upload", Auth, uploadRoutes);
app.use("/api/records", Auth, recordRoutes);
app.use("/api/price-range", Auth, priceRangeRoutes);
app.use("/api", authRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
