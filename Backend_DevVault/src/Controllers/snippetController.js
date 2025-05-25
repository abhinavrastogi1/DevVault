import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import OpenAi from "openai";
const openAi = new OpenAi({
  apiKey: process.env.OPEN_AI_API_KEY,
});
 async function  aiResponse(tasks=[],snippet="",userQuestion="",language="javascript") {
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
      "7. For each completed task, add a short explanation in the 'response' object: { task: '...', explanation: '...' }",
      "8. If a task cannot be completed with code or a simple explanation, leave it 'completed: false'.",
      "9. If the user provided code, use it to assist or fix the relevant task.",
      "10. Always respond to the 'userQuestions' field if present.",
      "11. Output MUST follow this structure: { tasks: [...], code: '...', response: {...}, userQuestions: '...', notes: '...', language: '...' }",
      "12. If there are no tasks, return tasks as an empty array. Leave code and response empty.",
      "13. Mention the language used for the code.",
      "14. if questions are asked, answer them in the userQuestion field. even if all tasks are completed.",
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
    "tasks": [ ...updated tasks... ],
    "code": "...code string if any task involved coding..." code for every task in the same code key but formatted,
    "response": {
     { "task": "...task name...",
      "explanation": "...simple explanation of what the code does..."},
       { "task": "...task name...",
      "explanation": "...simple explanation of what the code does..."}
    }
    "userQuestion": "...response to user questions if any...",
    "notes": "You can add any additional notes or comments here.necessary, if user ask for notes and the notes ",
    "language": "language used for the code, e.g., 'javascript', 'python', etc."
  }
  }
  
  Only complete the tasks that are clearly achievable with code or explanation. Leave the rest as incomplete (false).
  `;
  console.log(tasks)
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
    });
    return rawResponse;
}

const createSnippet = asyncHandler(async (req, res) => {
  const { title, snippet, userQuestion, tasks, notes, language } = req?.body;
  if (!title || (userQuestion == "" && tasks.length === 0) || !language) {
    throw new apiError(400, "Please provide all the required fields: title, tasks, language.");
  }
  if (snippet.length > 1000) {
  throw new apiError(400, "Snippet is too long. Please limit it to 1000 characters.");
  }
const  rawResponse= await aiResponse(tasks,snippet,userQuestion,language) 
  console.log("Raw response from OpenAI:", rawResponse);
  const response = JSON.parse(rawResponse.choices[0].message.content);
  console.log("Response from OpenAI:", response.code);
  res.status(200).json(new apiResponse(200,response , "Snippet Successfully Created "));

});

export { createSnippet };
