"use client";

import { Note } from "@prisma/client";
import { SearchIcon } from "lucide-react";
import {
  SidebarGroupContent as SidebarGroupContentShadCN,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
import { useRouter, useSearchParams } from "next/navigation";
import NoteProvider from "@/providers/NoteProvider";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get("noteId");

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["title", "text"],
      threshold: 0.4,
    });
  }, [localNotes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const [deletedNoteId, setDeletedNoteId] = useState<string | null>(null);

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== noteId),
    );
    setDeletedNoteId(noteId);
  };

  useEffect(() => {
    if (!deletedNoteId) return;

    if (deletedNoteId === currentNoteId) {
      if (localNotes.length > 0) {
        router.push(`/?noteId=${localNotes[0].id}`);
      } else {
        router.push("/");
      }
    }

    setDeletedNoteId(null); // Reset after handling
  }, [deletedNoteId, currentNoteId, localNotes, router]);

  return (
    <SidebarGroupContentShadCN>
      <div className="relative w-full max-w-sm">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="h-9 pl-10 text-sm"
          placeholder="Search for your notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <SidebarMenu className="mt-4">
        {filteredNotes.map((note) => {
          const isSelected = note.id === currentNoteId;
          const selectButton = <SelectNoteButton key={note.id} note={note} />;

          return (
            <SidebarMenuItem key={note.id} className="group/item">
              {isSelected ? (
                <NoteProvider
                  noteId={note.id}
                  initialNoteText={note.text || ""}
                >
                  {selectButton}
                </NoteProvider>
              ) : (
                selectButton
              )}
              <DeleteNoteButton
                noteId={note.id}
                deleteNoteLocally={deleteNoteLocally}
              />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
