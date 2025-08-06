"use client";

import { createContext, useState, useEffect } from "react";

type NoteProviderContextType = {
  noteText: string;
  setNoteText: (noteText: string) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteText: "",
  setNoteText: () => {},
});

type Props = {
  children: React.ReactNode;
  initialNoteText: string;
  noteId: string;
};

function NoteProvider({ children, initialNoteText, noteId }: Props) {
  const [noteText, setNoteText] = useState(initialNoteText || "");

  useEffect(() => {
    setNoteText(initialNoteText || "");
  }, [noteId, initialNoteText]);

  return (
    <NoteProviderContext.Provider value={{ noteText, setNoteText }}>
      {children}
    </NoteProviderContext.Provider>
  );
}

export default NoteProvider;
