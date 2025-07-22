import { getUser } from "@/auth/server"; 
import { prisma } from "@/db/prisma"; 
import { NextResponse } from "next/server"; 

export async function GET(req: Request) { 
  const { searchParams } = new URL(req.url); 
  const noteId = searchParams.get("noteId"); 

  const user = await getUser(); 
  if (!noteId || !user) { 
    return NextResponse.json({error: "Invalid Request"}, {status: 400}); 
  }

  const note = await prisma.note.findFirst({
    where: {id: noteId, authorId: user.id},
  }); 

  if (!note) { 
    return NextResponse.json({error: "Note not found"}, {status: 404}); 
  }

   return NextResponse.json(note); 
}