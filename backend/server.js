// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./server/config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./server/inngest/index.js";

const app = express();
const port = process.env.PORT || 3000;

async function start() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("DB connected.");

    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(clerkMiddleware());

    // Routes
    app.get("/", (req, res) => res.send("Server is Live"));

    // Inngest
    app.use("/api/inngest", serve({ client: inngest, functions }));

    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
}

start();
