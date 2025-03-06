import "dotenv/config"
import express from "express";
import teachersRouter from "./api/availableTeachers";
import { connectDB } from "./infrastructure/db";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// app.get("/", (req, res) => {
//     res.json("This is the root endpoint")
// })


app.use("/teachers",teachersRouter);
app.use("/kuppiGroups")


const PORT = 8080;
app.listen(PORT, () => console.log(`Server is listening on port${PORT} .`));
