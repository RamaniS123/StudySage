"use server"

import { getUser } from "@/auth/server"; 
import { prisma } from "@/db/prisma"; 
import { handleError } from "@/lib/utils"; 
import openai from "@/openai"; 

export async function generateQuizAction(noteId: string, noteText: string) { 
  try { 
    const user = await getUser(); 
    if (!user) { 
      throw new Error("Not authenticated"); 
    }

    const prompt = `
      Generate 5 multiple-choice quiz questions based on the following note: 

      "${noteText}"

      Format:
        [
          { 
            "question": "...",
            "options": ["A", "B", "C", "D"], 
            "answer": "B"
          }
        ]
      `; 

      const response = await openai.chat.completions.create({ 
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt}],
      }); 

      const quizJSON = JSON.parse(response.choices[0].message.content || "[]"); 

      quizJSON.forEach((q: any) => { 
        const answerLetter = q.answer; 
        const answerIndex = ["A", "B", "C", "D"].indexOf(answerLetter); 
        q.answer = q.options[answerIndex]; 
      }); 
      const quiz = await prisma.quiz.create({ 
        data: { 
          title: `Quiz for Note: ${noteText.slice(0, 30)}...`,
          authorId: user.id, 
          noteId, 
          questions: { 
            create: quizJSON.map((q: any) => ({ 
              question: q.question, 
              options: q.options, 
              answer: q.answer, 
            })),
          },
        },
      }); 

      return {success: true, quizId: quiz.id}
  } catch (error) { 
    console.error("Quiz generation error:", error);
    return handleError(error); 
    
  }
}