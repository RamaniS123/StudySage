import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";
  const { id, title } = await request.json();

  const { id: noteId } = await prisma.note.create({
    data: {
      id,
      authorId: userId,
      title: title || "Untitled Note",
      text: "",
    },
  });

  return NextResponse.json({ noteId });
}
