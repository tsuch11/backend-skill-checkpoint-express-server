import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answersRouter = Router();

const MAX_ANSWER_LENGTH = 300;

const isValidAnswerContent = (content) =>
  typeof content === "string" && content.trim().length > 0 && content.length <= MAX_ANSWER_LENGTH;

const findQuestionById = async (questionId) => {
  const result = await connectionPool.query(`SELECT id FROM questions WHERE id = $1`, [
    questionId,
  ]);

  return result.rows[0];
};

answersRouter.post("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;

  if (!isValidAnswerContent(content)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    const question = await findQuestionById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(`INSERT INTO answers (question_id, content) VALUES ($1, $2)`, [
      questionId,
      content,
    ]);

    return res.status(201).json({ message: "Answer created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create answers." });
  }
});

answersRouter.get("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await findQuestionById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(
      `SELECT id, content FROM answers WHERE question_id = $1 ORDER BY id ASC`,
      [questionId]
    );

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch answers." });
  }
});

answersRouter.delete("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await findQuestionById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(`DELETE FROM answers WHERE question_id = $1`, [questionId]);

    return res
      .status(200)
      .json({ message: "All answers for the question have been deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default answersRouter;
