"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  user: {
    id: string;
  } | null;
};

export default function NewNoteButton({ user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    const newNoteId = uuidv4();
    startTransition(async () => {
      const { errorMessage } = await createNoteAction(
        newNoteId,
        title || "Untitled Note",
      );

      if (errorMessage) {
        console.error("Failed to create note:", errorMessage);
        return;
      }

      setOpen(false);
      router.push(`/?noteId=${newNoteId}`);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">New Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
          <DialogDescription>
            Enter a title for your new note.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Meeting Notes"
        />
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
