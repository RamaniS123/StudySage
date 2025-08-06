"use client";

import { useState } from "react";

export default function RenderQuiz({
  title,
  questions,
  quizId,
}: {
  title: string;
  questions: any[];
  quizId: string;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.filter(
    (q) => selectedAnswers[q.id] === q.answer,
  ).length;

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>

      {questions.map((q, idx) => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold">
            {idx + 1}. {q.question}
          </p>
          <ul className="mt-2 space-y-1 pl-4">
            {q.options.map((opt: string, optIdx: number) => (
              <li
                key={optIdx}
                onClick={() =>
                  !submitted &&
                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))
                }
                className={`cursor-pointer rounded border px-2 py-1 ${
                  selectedAnswers[q.id] === opt ? "bg-blue-400" : ""
                } ${
                  submitted
                    ? opt === q.answer
                      ? "bg-green-400"
                      : selectedAnswers[q.id] === opt
                        ? "bg-red-400"
                        : ""
                    : ""
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="hover:bg-primary-800 mt-4 rounded bg-blue-400 px-4 py-2 text-white transition"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="mt-4 font-semibold">
          You got {score} out of {questions.length} correct.
        </p>
      )}
    </div>
  );
}
