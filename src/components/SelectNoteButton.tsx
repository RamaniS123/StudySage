"use client";

import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
  note: Note;
};

function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || "";
  const isSelected = note.id === noteId;

  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${
        isSelected ? "bg-sidebar-accent/50" : ""
      }`}
    >
      <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
        <p className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
          {note.title || "Untitled Note"}
        </p>
        <p className="text-muted-foreground text-xs">
          {note.updatedAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectNoteButton;
