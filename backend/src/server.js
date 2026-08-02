import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js"; //importing the auth routes from the auth.route.js file 
import messageRoutes from "./routes/message.route.js"; //importing the message routes from the message.route.js file

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`)});
