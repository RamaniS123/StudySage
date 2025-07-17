"use client";

import { useEffect, useState } from "react";
import RenderQuiz from "@/components/RenderQuiz";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function QuizPage({ searchParams }: Props) {
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const quizId = Array.isArray(searchParams.quizId)
      ? searchParams.quizId[0]
      : searchParams.quizId;

    if (!quizId) return;

    const fetchQuiz = async () => {
      const res = await fetch(`/api/get-quiz?quizId=${quizId}`);
      const data = await res.json();
      setQuiz(data);
    };

    fetchQuiz();
  }, [searchParams.quizId]);

  if (!quiz) return <p className="p-4">Loading...</p>;

  return (
    <RenderQuiz
      title={quiz.title}
      questions={quiz.questions}
      quizId={quiz.id}
    />
  );
}
