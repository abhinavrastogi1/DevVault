import { pool } from "../DB/index.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import OpenAi from "openai";
const openAi = new OpenAi({
  apiKey: process.env.OPEN_AI_API_KEY,
});
async function aiResponse(
  tasks = [],
  snippet = "",
  userQuestion = "",
  language = "javascript"
) {
  const prompt = `
  You are a helpful assistant. You will be given a list of tasks. For each task:
  {
     {
    "instructions": [
      "1. Only complete tasks where 'completed' is false.",
      "2. Do NOT modify or process any task where 'completed' is true. Leave it exactly as it is.",
      "3. If all tasks are marked as 'completed: true', DO NOT perform any action on tasks. Just return them as they are.",
      "4. HOWEVER, still respond to 'userQuestions' even if all tasks are completed.",
      "5. For each task with 'completed: false', if it can be done with code and a short explanation, set 'completed: true'.",
      "6. Write all code for completed tasks in the 'code' field as a single multi-line string. Format it like Prettier: tabWidth 2, semi, single quotes, trailing commas.",
      "7. For each completed task, add a short explanation in completedTasks: [{
      "taskId": "...taskId..."",
      "taskDescription": "...task name...",
      "completed": true,
      "explanation": "... detailed explanation of what the user asked for and what the code does..."
    }
  ],
      "8. If a task cannot be completed with code or a simple explanation, leave it 'completed: false'.",
      "9. If the user provided code, use it to assist or fix the relevant task.",
      "10. Always respond to the 'userQuestions' field if present.",
    "11. Output MUST follow this structure strictly: { generatedCode: '...', completedTasks: [{..},{..}], remainingTasks: [{..},{..}], userQueryResponse: '...', developerNotes: '...', programmingLanguage: '...' }",
      "12. If there are no tasks, return tasks as an empty array. Leave code and response empty.",
      "13. Mention the language used for the code.",
      "14. if questions are asked, answer them in the userQuestion field. even if all tasks are completed.",
       "15. Separate each task's code with a comment header in this format: // Task 1 code, // Task 2 code, etc.",
       "if user ask for code you should provide him code in the generatedCode field and explaination in userQueryResponse

    ]
       "instructionForCodeGeneration":[
    "1. Only complete tasks where 'completed' is false.",
    "2. DO NOT leave placeholder or stub functions.",
    "3. DO NOT return pseudocode or just function signatures.",
    "4. All code must be fully working, production-quality, and safe.",
    "5. Each task MUST include the complete implementation inside the 'generatedCode' block.",
    "6. The code must be complete, not partially implemented or empty.",
    "7. Include business logic, input validation, error handling, security practices (e.g., hashing passwords, checking token validity, sanitizing inputs, etc.).",
    "8. Use appropriate libraries and tools that are commonly used in real-world applications (e.g., bcrypt, JWT, etc.).",
    "9. Explain what the code does briefly in the 'explanation' field of each completed task.",
    "10. Format code with Prettier-style: tabWidth 2, use semicolons, single quotes, trailing commas.",
    "11. Follow RESTful practices if applicable.",
    "12. Make the code work with real data (assume database if needed).",
    "13. No comments like '// do this later' or '// logic here'.",
    "14. The output MUST be fully functional code, not mockups.",
    ]
  }
  ,
   "tasks": ${JSON.stringify(tasks)},
      "code": ${JSON.stringify(snippet)},
      "userQuestion": ${JSON.stringify(userQuestion)},
      "notes": "provide notes for the problem all important points to note down",
      "language": ${JSON.stringify(language)}
  }
  Return the result in the following format:
  {
  generatedCode:  "...code string if any task involved coding..." code for every task in the same code key but formatted",
  completedTasks: [
    {
      "task_id": "provided task_id",
      "taskDescription": "...task name...",
      "completed": true,
      "explanation": "... detailed explanation of what the user asked for and what the code does..."
    }, {
      "task_id": "provided task_id",
      "taskDescription": "...task name...",
      "completed": true,
      "explanation": "... detailed explanation of what the user asked for and what the code does..."
    }
  ],
  remainingTasks: [
    {
     "task_id": "...same as provided task_id ",
      "taskDescription": "...task name...",
      "completed": false
    }
  ],
  userQueryResponse: "...response to user questions if any...",
  developerNotes: "You can add any additional notes or comments here.necessary, if user ask for notes and the notes ",
  programmingLanguage: "language used for the code, e.g., 'javascript', 'python', etc."
}
  }
  
  Only complete the tasks that are clearly achievable with code or explanation. Leave the rest as incomplete (false).
  `;
  try {
    const rawResponse = await openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only formatter assistant. You must return valid JSON only with no extra commentary or markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });
    return rawResponse;
  } catch (error) {
    throw new apiError(500, "Error generating AI response: " + error.message);
  }
}

const createSnippet = asyncHandler(async (req, res) => {
  const { title, snippet, userQuestion, tasks, notes, language } = req?.body;
  const { user_id } = req?.user;
  if (!user_id) {
    throw new apiError(400, "user_id is required");
  }
  const user = await pool.query("select user_id from users WHERE user_id=$1", [
    user_id,
  ]);
  if (!user.rows[0]?.user_id) {
    throw new apiError(401, "Unauthorized Access");
  }
  if (!title || (userQuestion == "" && tasks.length === 0) || !language) {
    throw new apiError(
      400,
      "Please provide all the required fields: title, tasks, language."
    );
  }
  if (snippet.length > 1000) {
    throw new apiError(
      400,
      "Snippet is too long. Please limit it to 1000 characters."
    );
  }
  const rawResponse = await aiResponse(tasks, snippet, userQuestion, language);
  let response;
  try {
    response = JSON.parse(rawResponse.choices[0].message.content);
  } catch (error) {
    throw new apiError(400, "Error while parsing Json response ");
  }
 const {generatedCode,completedTasks,remainingTasks,userQueryResponse,programmingLanguage,developerNotes}=response
  const createSnippet = await pool.query(
    "INSERT INTO snippets (snippet_code,user_id,snippet_title,language ) VALUES($1,$2,$3,$4) RETURNING snippet_code,user_id,snippet_title ,snippet_id;",
    [generatedCode, user_id, title, programmingLanguage]
  );
  if (!createSnippet.rows[0].snippet_id) {
    throw new apiError(500, "something went wrong while creating snippet");
  }
  const snippet_id = createSnippet.rows[0].snippet_id;
  const alltasks = [...completedTasks, ...remainingTasks];
  if (alltasks.length > 0) {
    for (const task of alltasks) {
      if (!task.task_id) {
        const { taskDescription, completed, explanation } = task;
        await pool.query(
          "INSERT INTO tasks (task_description, is_completed, explanation, snippet_id) VALUES ($1, $2, $3, $4);",
          [taskDescription, completed, explanation, snippet_id]
        );
      }
    }
    
  }
  if (developerNotes != "") {
    await pool.query(
      "INSERT INTO notes (note_description,snippet_id)VALUES($1,$2) RETURNING note_id;",
      [developerNotes, snippet_id]
    );
  }
  if (userQueryResponse != "" && userQuestion) {
    const userquestion = await pool.query(
      "INSERT INTO userquestions (ai_response,userquestion,snippet_id)VALUES($1,$2,$3) RETURNING question_id;",
      [userQueryResponse, userQuestion, snippet_id]
    );
    if (!userquestion.rows[0].question_id) {
      throw new apiError(500, "something went wrong while saving solution");
    }
  }
  res
    .status(200)
    .json(new apiResponse(200, {...response,snippet_id}, "Snippet Successfully Created "));
});

export { createSnippet };
