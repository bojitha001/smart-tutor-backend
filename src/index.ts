import express from "express";
import teachersRouter from "./api/availableTeachers";
import { connectDB } from "./infrastructure/db";


const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json("This is the root endpoint")
})


app.use("/teachers",teachersRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is listening on port${PORT} .`));
