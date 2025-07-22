"use server"; 

import { getUser } from "@/auth/server"; 
import { prisma } from "@/db/prisma"; 
import { handleError } from "@/lib/utils"; 
import openai from "@/openai"; 

export async function generateQuizAction(noteId: string, noteText: string) { 
  try { 
    const user = await getUser(); 
    if(!user) { 
      throw new Error("Not authenticated"); 
    }

    // Check for existing quiz for this note and user
    const existingQuiz = await prisma.quiz.findFirst({ 
      where: { 
        noteId, 
        authorId: user.id,
      },
    }); 

    if (existingQuiz) { 
      return { success: true, quizId: existingQuiz.id}
    }

    // Prompt for quiz 
    const prompt = `
    Generate exactly 5 multiple-choice quiz questions based ONLY on the factual content in the following note. DO NOT invent details or infer information (e.g., dates, authorship, project goals) that is not explicitly written.:

    "${noteText}"

    Each question should:
    - Be clear and concise
    - Use different phrasing (e.g., "Which of the following...", "Who...", "When...", "What is...")

    Format your response as a **valid JSON array** (no markdown, no extra text), like this:

    [
      {
        "question": "Which of the following is true about photosynthesis?",
        "options": ["A. It uses oxygen", "B. It produces carbon dioxide", "C. It happens in roots", "D. It occurs in leaves"],
        "answer": "D"
      },
      {
        "question": "Who proposed the theory of relativity?",
        "options": ["A. Newton", "B. Tesla", "C. Einstein", "D. Galileo"],
        "answer": "C"
      }
    ]

    Respond ONLY with JSON, no additional explanation.
    `;


    const response = await openai.chat.completions.create({ 
      model:"gpt-4o-mini",
      messages: [{ role: "user", content: prompt}],
    }); 

    // Log response
    const content = response.choices[0].message.content || ""; 
    console.log("OpenAI raw response:", content); 

    let quizJSON; 
    try { 
      quizJSON = JSON.parse(content); 
    } catch (error) { 
      console.error("Failed to parse OpenAI response", error); 
      return {success: false, error: "Invalid AI response format"}; 
    }

    // Convert the answers to options 
    quizJSON.forEach((q: any) => { 
      q.options = q.options.map((opt: string) => 
        opt.replace(/^[A-D]\.\s*/, "").trim()
      ); 

      const answerLetter = q.answer; 
      const answerIndex = ["A", "B", "C", "D"].indexOf(answerLetter); 
      q.answer = q.options[answerIndex]; 
    }); 

    // Save quiz
    const quiz = await prisma.quiz.create({ 
      data: { 
        title: `Quiz for Note: ${noteText.slice(0, 30)}...`,
        authorId: user.id, 
        noteId, 
        questions: { 
          create: quizJSON.map((q: any)=> ({ 
            question: q.question, 
            options: q.options, 
            answer: q.answer,
          })),
        },
      },
    }); 

    return { success: true, quizId: quiz.id}; 
  } catch (error) { 
    console.error("Quiz generation error:", error); 
    return handleError(error); 
  }
}