"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AskAIButton from "@/components/AskAIButton";
import GenerateQuizButton from "@/components/GenerateQuizButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import { User } from "@supabase/supabase-js";
import NoteProvider from "@/providers/NoteProvider";

type Props = {
  user: User | null;
};

export default function ClientHome({ user }: Props) {
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId") || "";

  const [noteText, setNoteText] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [hasAnyNotes, setHasAnyNotes] = useState<boolean>(true);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) {
        setNoteText(null);
        setHasAnyNotes(false);
        return;
      }

      try {
        const res = await fetch(`/api/get-note?noteId=${noteId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setHasAnyNotes(false);
          }
          throw new Error("Failed to fetch note");
        }

        const data = await res.json();
        setNoteText(data.text || "");
        setError(false);
        setHasAnyNotes(true);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
        setNoteText("");
      }
    };

    fetchNote();
  }, [noteId]);

  return (
    <NoteProvider key={noteId} noteId={noteId} initialNoteText={noteText || ""}>
      <div className="flex h-full flex-col items-center gap-4">
        <div className="flex w-full max-w-4xl justify-end gap-2">
          <AskAIButton user={user} noteId={noteId} />
          <GenerateQuizButton noteId={noteId} />
          <NewNoteButton user={user} />
        </div>

        {error ? (
          hasAnyNotes ? (
            <p className="mt-4 text-red-500">Failed to load note.</p>
          ) : (
            <p className="text-muted-foreground mt-4">
              You have no notes yet. Click <strong>“New Note”</strong> to create
              your first one.
            </p>
          )
        ) : noteText === null ? (
          <p className="text-muted-foreground mt-4">
            Select an existing note or click on <strong>"New Note"</strong> to
            get started.
          </p>
        ) : (
          <NoteTextInput noteId={noteId} startingNoteText={noteText} />
        )}
      </div>
    </NoteProvider>
  );
}
