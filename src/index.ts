import "dotenv/config"
import express from "express";
import teachersRouter from "./api/availableTeachers";
import { connectDB } from "./infrastructure/db";
import cors from "cors"
import communityRouter from "./api/communities";
import communityQuestionFormRouter from "./api/communityQuestionFrom";
import answersRouter from "./api/answers";
// import updateUserRoleRouter from "./api/user";
import classesRouter from "./api/classes";
import studentRouter from "./api/students";
import { clerkClient } from '@clerk/clerk-sdk-node';
import chatbotRouter from "./api/chatbot";
import bookingsRouter from "./api/bookings";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// app.get("/", (req, res) => {
//     res.json("This is the root endpoint")
// })


app.use("/teachers",teachersRouter);
app.use('/communities', communityRouter);
app.use('/comunityQuestions', communityQuestionFormRouter);
app.use('/answers',answersRouter);
// app.use('/user', updateUserRoleRouter);
app.use('/classes', classesRouter);
app.use('/students', studentRouter);
app.use('/bookings', bookingsRouter);
app.use('/chatbot', chatbotRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is listening on port${PORT}.`));
