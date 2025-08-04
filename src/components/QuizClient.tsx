"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RenderQuiz from "@/components/RenderQuiz";

export default function QuizClient() {
  const [quiz, setQuiz] = useState<any>(null);
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const res = await fetch(`/api/get-quiz?quizId=${quizId}`);
      const data = await res.json();
      setQuiz(data);
    };

    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <p className="p-4">Loading...</p>;

  return (
    <RenderQuiz
      title={quiz.title}
      questions={quiz.questions}
      quizId={quiz.id}
    />
  );
}
