import express from "express";
import questionsRouter from "./routers/questions.router.mjs";
import answersRouter from "./routers/answers.router.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionsRouter);
app.use("/questions", answersRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).json({ message: "Something went wrong." });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
