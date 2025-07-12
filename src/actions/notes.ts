"use server"

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const updateNotesAction = async (notedId: string, text: string) => { 
  try { 
    const user = await getUser(); 
    if (!user) throw new Error("YOu must be logges into update a note"); 

    await prisma.note.update({ 
      where: { id: notedId },
      data: { text }, 
    }); 

    return { errorMessage: null}; 
    
  } catch (error) { 
    return handleError(error); 
  }
}
