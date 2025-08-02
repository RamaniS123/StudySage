"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AskAIButton from "@/components/AskAIButton";
import GenerateQuizButton from "@/components/GenerateQuizButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

export default function ClientHome({ user }: Props) {
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId") || "";

  const [noteText, setNoteText] = useState<string | null>(null); // null = loading state
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;

      try {
        const res = await fetch(`/api/get-note?noteId=${noteId}`);
        if (!res.ok) throw new Error("Failed to fetch note");

        const data = await res.json();
        setNoteText(data.text || ""); // If empty, still editable
        setError(false);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
        setNoteText("");
      }
    };

    fetchNote();
  }, [noteId]);

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} noteId={noteId} />
        <GenerateQuizButton noteId={noteId} noteText={noteText || ""} />
        <NewNoteButton user={user} />
      </div>

      {error ? (
        <p className="mt-4 text-red-500">Failed to load note.</p>
      ) : noteText === null ? (
        <p className="text-muted-foreground mt-4">Loading note...</p>
      ) : (
        <NoteTextInput noteId={noteId} startingNoteText={noteText} />
      )}
    </div>
  );
}
