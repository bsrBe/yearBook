import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import signatureRoutes from "./routes/signatureRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import  connectDB  from "./config/db.js";
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
import * as dotenv from 'dotenv';

const app = express();

dotenv.config({ path: "./config/.env" });

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173", "http://localhost:5000"];

app.use(
    cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Cors"));
      }
    },
    credentials: true,
  })
);

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    withCredentials: true,  // Make sure cookies are sent with requests
  }
}));








  app.use(cookieParser());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/signatures", signatureRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/comments", commentRoutes);

connectDB();

app.listen(5000, () => {
  console.log("server listenning on Port",process.env.PORT||5000);
});
