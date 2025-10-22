import express from "express";
import dotenv from "dotenv";
import stringRoutes from "./routes/stringRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", stringRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
