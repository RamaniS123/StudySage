"use client";

import { useTransition, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { generateQuizAction } from "@/actions/quiz";
import { toast } from "sonner";
import { NoteProviderContext } from "@/providers/NoteProvider";

type Props = {
  noteId: string;
};

export default function GenerateQuizButton({ noteId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { noteText } = useContext(NoteProviderContext);

  const handleGenerate = () => {
    if (!noteText || !noteText.trim()) {
      toast.warning("Please enter some note content before generating a quiz.");
      return;
    }

    startTransition(async () => {
      const res = await generateQuizAction(noteId, noteText);

      if ("quizId" in res) {
        toast.success("Quiz generated! Redirecting...");
        router.push(`/quiz?quizId=${res.quizId}`);
      } else {
        toast.error("Quiz generation failed. Please try again.");
      }
    });
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending || !noteText?.trim()}
      variant="secondary"
    >
      {isPending ? "Generating..." : "Generate Quiz"}
    </Button>
  );
}
