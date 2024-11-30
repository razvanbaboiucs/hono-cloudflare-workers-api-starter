import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated";
import { HTTPException } from "hono/http-exception";
import { getDatabase } from "../db";
import { questions } from "../db/schema";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("/*", async (c, next) => authenticated(c, next));

// Routes
app.post("/question", async (c) => {
  const { question } = await c.req.json();
  if (!question) {
    console.error("Question is empty");
    throw new HTTPException(400, { message: "Question is empty" });
  }
  const textGenModel = "@cf/meta/llama-3-8b-instruct"; // Change this to your preferred model

  const startTime = performance.now();
  const aiResponse = (await c.env.AI.run(textGenModel, {
    max_tokens: 50, // Maximum number of tokens to generate. Change if you want to generate more or less.
    messages: [
      {
        role: "system",
        // System message to start the conversation. This can control the behavior of the model.
        content: `You are an all-knowing god. You shall answer every question like it's something you knew for over one million years.
            Sound like an old wise person. Your answer should be as short as possible.`,
      },
      { role: "user", content: question },
    ],
  })) as { response: string };
  const endTime = performance.now();
  const processingTime = endTime - startTime;

  const db = getDatabase(c);
  await db.insert(questions).values({
    question,
    modelUsed: textGenModel,
    answer: aiResponse.response,
    userId: c.get("user").id,
    processingTime,
  });

  return c.json(aiResponse);
});

export default app;
