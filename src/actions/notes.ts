"use server"

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const createNoteAction = async (notedId: string) => { 
  try { 
    const user = await getUser(); 
    if (!user) throw new Error("You must be logged in to create a note"); 

    await prisma.note.create({ 
      data: {
        id: notedId, 
        authorId: user.id, 
        text: "",
      },
    }); 

    return { errorMessage: null}; 
    
  } catch (error) { 
    return handleError(error); 
  }
}; 

export const updateNoteAction = async (notedId: string, text: string) => { 
  try { 
    const user = await getUser(); 
    if (!user) throw new Error("You must be loggds in to update a note"); 

    await prisma.note.update({ 
      where: { id: notedId },
      data: { text }, 
    }); 

    return { errorMessage: null}; 
    
  } catch (error) { 
    return handleError(error); 
  }
}; 
