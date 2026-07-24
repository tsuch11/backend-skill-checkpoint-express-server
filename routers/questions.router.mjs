import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const isValidQuestionBody = ({ title, description, category }) =>
  isNonEmptyString(title) && isNonEmptyString(description) && isNonEmptyString(category);

questionsRouter.post("/", async (req, res) => {
  const { title, description, category } = req.body;

  if (!isValidQuestionBody({ title, description, category })) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    await connectionPool.query(
      `INSERT INTO questions (title, description, category) VALUES ($1, $2, $3)`,
      [title, description, category]
    );

    return res.status(201).json({ message: "Question created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create question." });
  }
});

questionsRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`SELECT * FROM questions ORDER BY id ASC`);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

questionsRouter.get("/search", async (req, res) => {
  const { title, category } = req.query;

  if (!isNonEmptyString(title) && !isNonEmptyString(category)) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }

  try {
    const conditions = [];
    const values = [];

    if (isNonEmptyString(title)) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (isNonEmptyString(category)) {
      values.push(`%${category}%`);
      conditions.push(`category ILIKE $${values.length}`);
    }

    const result = await connectionPool.query(
      `SELECT * FROM questions WHERE ${conditions.join(" OR ")} ORDER BY id ASC`,
      values
    );

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch a question." });
  }
});

questionsRouter.get("/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const result = await connectionPool.query(`SELECT * FROM questions WHERE id = $1`, [
      questionId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

questionsRouter.put("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;

  if (!isValidQuestionBody({ title, description, category })) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    const existing = await connectionPool.query(`SELECT id FROM questions WHERE id = $1`, [
      questionId,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      `UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4`,
      [title, description, category, questionId]
    );

    return res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

questionsRouter.delete("/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const existing = await connectionPool.query(`SELECT id FROM questions WHERE id = $1`, [
      questionId,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(`DELETE FROM questions WHERE id = $1`, [questionId]);

    return res.status(200).json({ message: "Question post has been deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete question." });
  }
});

export default questionsRouter;
