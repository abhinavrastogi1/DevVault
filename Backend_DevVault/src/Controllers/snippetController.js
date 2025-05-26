import { pool } from "../DB/index.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import OpenAi from "openai";
import { options } from "./userController.js";
const openAi = new OpenAi({
  apiKey: process.env.OPEN_AI_API_KEY,
});
//fetch response from ai
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
//create new task document
async function createTask(taskDescription, completed, explanation, snippetId) {
  try {
    const taskRawData = await pool.query(
      "INSERT INTO tasks (task_description, is_completed, explanation, snippet_id) VALUES ($1, $2, $3, $4) RETURNING task_id,task_description,is_completed,explanation;",
      [taskDescription, completed, explanation, snippetId]
    );
    return taskRawData.rows[0];
  } catch (error) {
    throw new apiError(500, "error:" + error);
  }
}
// create new note document
async function createNote(developerNotes, snippetId) {
  try {
    const notesRawData = await pool.query(
      "INSERT INTO notes (note_description,snippet_id)VALUES($1,$2) RETURNING note_id,note_description ;",
      [developerNotes, snippetId]
    );
    return notesRawData.rows;
  } catch (error) {
    throw new apiError(500, "error:" + error);
  }
}
//create new question document
async function createQuestion(userQueryResponse, userQuestion, snippetId) {
  try {
    const userquestion = await pool.query(
      "INSERT INTO userquestions (ai_response,userquestion,snippet_id)VALUES($1,$2,$3) RETURNING question_id;",
      [userQueryResponse, userQuestion, snippetId]
    );
    if (!userquestion.rows[0].question_id) {
      throw new apiError(500, "something went wrong while saving solution");
    }
  } catch (error) {
    throw new apiError(500, "error:" + error);
  }
}
async function getAllQuestion(snippetId) {
  const questionRawResonse = await pool.query(
    "SELECT  userquestion ,ai_response FROM userquestions WHERE snippet_id=$1;",
    [snippetId]
  );
  return questionRawResonse.rows;
}
async function getAllTasks(snippetId) {
  const tasksRawResponse = await pool.query(
    "SELECT task_id,task_description,is_completed,explanation FROM tasks WHERE snippet_id=$1;",
    [snippetId]
  );
  return tasksRawResponse.rows;
}
//create new snippet
async function createSnippet(
  generatedCode,
  completedTasks,
  remainingTasks,
  userQueryResponse,
  programmingLanguage,
  developerNotes,
  title,
  user_id,
  userQuestion
) {
  let userSnippet, userTasks, userNotes, userQuestionResponse;
  const createSnippet = await pool.query(
    "INSERT INTO snippets (snippet_code,user_id,snippet_title,language ) VALUES($1,$2,$3,$4) RETURNING snippet_id,snippet_code,created_at, updated_at,snippet_title,language ;",
    [generatedCode, user_id, title, programmingLanguage]
  );
  if (!createSnippet.rows[0].snippet_id) {
    throw new apiError(500, "something went wrong while creating snippet");
  }
  userSnippet = createSnippet.rows[0];
  const snippet_id = createSnippet.rows[0].snippet_id;
  const alltasks = [...completedTasks, ...remainingTasks];
  if (alltasks.length > 0) {
    let tempArr = [];
    for (const task of alltasks) {
      const { taskDescription, completed, explanation, task_id } = task;
      if (!task_id) {
        const taskRawData = await createTask(
          taskDescription,
          completed,
          explanation,
          snippet_id
        );
        tempArr.push(taskRawData);
      }
    }
    userTasks = tempArr;
  }
  if (developerNotes) {
    userNotes = await createNote(developerNotes, snippet_id);
  }
  if (userQueryResponse && userQuestion) {
    await createQuestion(userQueryResponse, userQuestion, snippet_id);
  }
  userQuestionResponse = await getAllQuestion(snippet_id);
  return {
    userSnippet,
    userTasks,
    userNotes,
    userQuestionResponse,
  };
}

//update the already created snippet
async function updatesnippet(
  snippetId,
  userQueryResponse,
  programmingLanguage,
  title,
  generatedCode,
  completedTasks,
  remainingTasks,
  developerNotes,
  noteId,
  userQuestion,
  user_id
) {
  // Check if the snippet exists
  let userSnippet, userTasks, userNotes, userQuestionResponse;
  try {
    const snippetExist = await pool.query(
      "SELECT snippet_id FROM snippets WHERE snippet_id=$1 and user_id=$2",
      [snippetId, user_id]
    );
    if (!snippetExist.rows[0].snippet_id) {
      throw new apiError(502, "snippet_id does not exist");
    }
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while fetching snippet" + error
    );
  }
  // Update the snippet with the new code and title
  try {
    if (generatedCode) {
      const updatedSnippet = await pool.query(
        "UPDATE snippets  SET snippet_code=$1,snippet_title=$2, language=$3 , updated_at = CURRENT_TIMESTAMP where snippet_id=$4 RETURNING snippet_id,snippet_code,created_at, updated_at,snippet_title,language ",
        [generatedCode, title, programmingLanguage, snippetId]
      );
      if (!updatedSnippet.rows[0].snippet_code) {
        throw new apiError(500, "Something went wrong while updating snippet ");
      }
      userSnippet = updatedSnippet.rows[0];
    }
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while updating snippet" + error
    );
  }
  // Update tasks and notes
  // Combine completed and remaining tasks
  const alltasks = [...completedTasks, ...remainingTasks];
  if (alltasks.length > 0) {
    for (const task of alltasks) {
      const { taskDescription, completed, explanation, task_id } = task;
      if (!task_id) {
        const taskRawData = await createTask(
          taskDescription,
          completed,
          explanation,
          snippetId
        );
      } else {
        const taskExist = await pool.query(
          "SELECT task_id FROM tasks WHERE task_id=$1",
          [task_id]
        );
        if (!taskExist.rows[0].task_id) {
          throw new apiError(500, "Task does not exist.");
        }
        const taskRawData = await pool.query(
          "UPDATE tasks SET task_description =$1, is_completed=$2, explanation=$3, updated_at = CURRENT_TIMESTAMP WHERE task_id=$4 RETURNING task_id,task_description,is_completed,explanation",
          [taskDescription, completed, explanation, task_id]
        );
      }
    }
    userTasks = await getAllTasks(snippetId);
  }
  // Update or create notes
  if (noteId) {
    const notesExist = await pool.query(
      "SELECT note_id FROM notes WHERE note_id=$1",
      [noteId]
    );
    if (!notesExist.rows[0].note_id) {
      throw new apiError(500, " Note does not exist  ");
    }
    const notesRawData = await pool.query(
      "UPDATE notes SET note_description=$1 , updated_at = CURRENT_TIMESTAMP WHERE note_id=$2 RETURNING note_id,note_description ",
      [developerNotes, noteId]
    );
    userNotes = notesRawData.rows;
  } else {
    userNotes = await createNote(developerNotes, snippetId);
  }

  if (userQueryResponse != "" && userQuestion) {
    await createQuestion(userQueryResponse, userQuestion, snippetId);
  }
  userQuestionResponse = await getAllQuestion(snippetId);
  return {
    userSnippet,
    userTasks,
    userNotes,
    userQuestionResponse,
  };
}
// snippet controller manages both updating and creating of snippet
const snippetController = asyncHandler(async (req, res) => {
  const { title, snippet, userQuestion, tasks, language, snippetId, noteId } =
    req?.body;
  const { user_id } = req?.user;
  if (!user_id) {
    throw new apiError(400, "user_id is required");
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
  if (!rawResponse?.choices?.[0]?.message?.content) {
    throw new apiError(500, "AI did not return a valid response");
  }
  let response;
  try {
    response = JSON.parse(rawResponse.choices[0].message.content);
  } catch (error) {
    throw new apiError(400, "Error while parsing Json response ");
  }
  let finalResponse;
  const {
    generatedCode,
    completedTasks,
    remainingTasks,
    userQueryResponse,
    programmingLanguage,
    developerNotes,
  } = response;
  // Validate the response structure
  if (snippetId) {
    const { userSnippet, userTasks, userNotes, userQuestionResponse } =
      await updatesnippet(
        snippetId,
        userQueryResponse,
        programmingLanguage,
        title,
        generatedCode,
        completedTasks,
        remainingTasks,
        developerNotes,
        noteId,
        userQuestion,
        user_id
      );
    finalResponse = {
      snippet: userSnippet,
      tasks: userTasks,
      notes: userNotes,
      userQuestion: userQuestionResponse,
    };
  } else {
    const { userSnippet, userTasks, userNotes, userQuestionResponse } =
      await createSnippet(
        generatedCode,
        completedTasks,
        remainingTasks,
        userQueryResponse,
        programmingLanguage,
        developerNotes,
        title,
        user_id,
        userQuestion
      );
    finalResponse = {
      snippet: userSnippet,
      tasks: userTasks,
      notes: userNotes,
      userQuestion: userQuestionResponse,
    };
  }

  if (req.user.access_token) {
    res
      .status(200)
      .json(
        new apiResponse(
          200,
          finalResponse,
          "snippet successfult created and updated"
        )
      )
      .cookie("access_token", req.user.access_token, options);
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        finalResponse,
        "snippet successfult created and updated"
      )
    );
});

const getAllSnippetsController = asyncHandler(async (req, res) => {
  const { user_id } = req?.user;
  if (!user_id) {
    throw new apiError(400, "user_id is required");
  }
  const snippets = await pool.query(
    "SELECT snippet_id,snippet_code,snippet_title,language FROM snippets WHERE user_id=$1",
    [user_id]
  );
  if (!snippets.rows[0]) {
    throw new apiError(404, "No snippets found for this user");
  }
  if (req.user.access_token) {
    res
      .status(200)
      .json(new apiResponse(200, snippets.rows, "Snippets fetched"))
      .cookie("access_token", req.user.access_token, options);
  }
  res.status(200).json(new apiResponse(200, snippets.rows, "Snippets fetched"));
});

const getSnippetByIdController = asyncHandler(async (req, res) => {
  const { snippetId } = req.query;
  if (!snippetId) {
    throw new apiError(400, "snippetId is required");
  }
  const { user_id } = req?.user;
  if (!snippetId || !user_id) {
    throw new apiError(400, "snippetId and user_id are required");
  }
  const [snippetResponse, tasksResponse, notesResponse, QuestionResponse] =
    await Promise.all([
      pool.query(
        "SELECT snippet_id,snippet_code,created_at, updated_at,snippet_title,language FROM snippets WHERE snippet_id=$1 AND user_id=$2;",
        [snippetId, user_id]
      ),
      pool.query(
        "SELECT task_id,task_description,is_completed,explanation FROM tasks WHERE snippet_id=$1;",
        [snippetId]
      ),
      pool.query(
        "SELECT note_id,note_description  FROM notes WHERE snippet_id=$1;",
        [snippetId]
      ),
      pool.query(
        "SELECT  userquestion ,ai_response FROM userquestions WHERE snippet_id=$1;",
        [snippetId]
      ),
    ]);

  // Check if snippet exists, if not, throw error
  if (!snippetResponse.rows[0].snippet_id) {
    throw new apiError(500, "Something went wrong while fetching data");
  }

  // Construct the final response
  const response = {
    snippet: snippetResponse?.rows[0],
    tasks: tasksResponse?.rows,
    notes: notesResponse?.rows,
    userQuestion: QuestionResponse?.rows,
  };
  if (req.user.access_token) {
    res
      .status(200)
      .json(new apiResponse(200, response, "Snippet fetched"))
      .cookie("access_token", req.user.access_token, options);
  }
  // Send the response
  res.status(200).json(new apiResponse(200, response, "Snippet fetched"));
});
export {
  snippetController,
  getSnippetByIdController,
  getAllSnippetsController,
};
