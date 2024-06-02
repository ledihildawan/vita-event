import cors from "cors";
import express from "express"
import mongoose from "mongoose";

import { authRouter } from "./routes/auth.js";
import { eventRouter } from "./routes/event.js";
import { dashboardRouter } from "./routes/dashboard.js";

const app = express();

mongoose.connect("mongodb+srv://ledi:thCZH0mSWE0LZwHa@cluster0.xjggk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/events", eventRouter);
app.use("/dashboard", dashboardRouter);

app.listen(3001, () => {
  console.log("SERVER STARTED!!!");
});
