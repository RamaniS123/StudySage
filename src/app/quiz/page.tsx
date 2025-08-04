import { Suspense } from "react";
import QuizClient from "@/components/QuizClient";

export default function QuizPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<p>Loading quiz...</p>}>
        <QuizClient />
      </Suspense>
    </div>
  );
}
