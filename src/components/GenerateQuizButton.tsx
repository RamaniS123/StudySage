"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { generateQuizAction } from "@/actions/quiz";
import { toast } from "sonner";

type Props = {
  noteId: string;
  noteText: string;
};

export default function GenerateQuizButton({ noteId, noteText }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGenerate = () => {
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
    <Button onClick={handleGenerate} disabled={isPending}>
      {isPending ? "Generating..." : "Generate Quiz"}
    </Button>
  );
}
