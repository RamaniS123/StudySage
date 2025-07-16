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

      const quiz = await prisma.quiz.create({ 
        data: { 
          title: "Untitle Quiz", 
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
    return handleError(error); 
  }
}