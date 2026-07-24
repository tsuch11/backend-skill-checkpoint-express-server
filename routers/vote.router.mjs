import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionVoteRouter = Router();
const answerVoteRouter = Router();

const isValidVoteValue = (vote) => typeof vote === "number" && (vote === 1 || vote === -1);

const findQuestionById = async (questionId) => {
  const result = await connectionPool.query(`SELECT id FROM questions WHERE id = $1`, [
    questionId,
  ]);

  return result.rows[0];
};

const findAnswerById = async (answerId) => {
  const result = await connectionPool.query(`SELECT id FROM answers WHERE id = $1`, [answerId]);

  return result.rows[0];
};

questionVoteRouter.post("/:questionId/vote", async (req, res) => {
  const { questionId } = req.params;
  const { vote } = req.body;

  if (!isValidVoteValue(vote)) {
    return res.status(400).json({ message: "Invalid vote value." });
  }

  try {
    const question = await findQuestionById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(`INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)`, [
      questionId,
      vote,
    ]);

    return res
      .status(200)
      .json({ message: "Vote on the question has been recorded successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to vote question." });
  }
});

answerVoteRouter.post("/:answerId/vote", async (req, res) => {
  const { answerId } = req.params;
  const { vote } = req.body;

  if (!isValidVoteValue(vote)) {
    return res.status(400).json({ message: "Invalid vote value." });
  }

  try {
    const answer = await findAnswerById(answerId);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    await connectionPool.query(`INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)`, [
      answerId,
      vote,
    ]);

    return res.status(200).json({ message: "Vote on the answer has been recorded successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to vote answer." });
  }
});

export { questionVoteRouter, answerVoteRouter };
