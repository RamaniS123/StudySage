import { prisma } from "@/db/prisma";
import { notFound } from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Quizpage({ searchParams }: Props) {
  const quizId = Array.isArray(searchParams.quizId)
    ? searchParams.quizId[0]
    : searchParams.quizId;

  if (!quizId) {
    return notFound();
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{quiz.title}</h1>
      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold">
            {idx + 1}. {q.question}
          </p>
          <ul className="mt-2 space-y-1 pl-4">
            {q.options.map((opt, optIdx) => (
              <li key={optIdx} className="rounded border px-2 py-1">
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
