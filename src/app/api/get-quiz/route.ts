import { NextResponse } from "next/server"; 
import { prisma } from "@/db/prisma"; 

export async function GET(req: Request) { 
  const { searchParams } = new URL(req.url); 
  const quizId = searchParams.get("quizId"); 

  if (!quizId) {
    return NextResponse.json({ error: "Missing quizId"}, { status: 400}); 
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id : quizId },
    include: {questions : true},
  }); 

  if (!quizId) { 
    return NextResponse.json({ error: "Quiz not found"}, { status: 400}); 
  }

  
  return NextResponse.json(quiz);
}
