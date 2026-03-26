import { PrismaClient } from "@prisma/client";
import AnnotationForm from "@/components/AnnotationForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const pendingArticle = await prisma.article.findFirst({
    where: { status: "PENDING" },
    orderBy: { id: "asc" },
  });

  if (!pendingArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-10 bg-slate-50">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 text-center max-w-lg">
          <div className="text-slate-400 mb-6 flex justify-center">
            <svg
              className="w-20 h-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">
            All Caught Up!
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            There are no more articles waiting for annotation right now. Great
            job!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Left Panel: Article Context */}
      <div className="w-full lg:w-1/2 p-6 lg:p-10 border-r border-slate-200 overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Legal Text Review
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Pending
            </span>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
            {pendingArticle.content}
          </div>
        </div>
      </div>

      {/* Right Panel: Annotation Form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          <AnnotationForm articleId={pendingArticle.id} />
        </div>
      </div>
    </div>
  );
}
