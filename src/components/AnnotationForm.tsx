"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { submitAnnotation } from "@/app/actions/annotation";
import toast from "react-hot-toast";
import { CheckCircle2, FileText, Send } from "lucide-react";

const formSchema = z.object({
  question: z
    .string()
    .min(10, { message: "Question must be at least 10 characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AnnotationForm({ articleId }: { articleId: string }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  });

  const onSubmit = (data: FormValues) => {
    setServerError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("articleId", articleId);
      formData.append("question", data.question);

      const res = await submitAnnotation(formData);
      if (res?.error) {
        setServerError(res.error);
        toast.error(res.error);
      } else {
        toast.success("Annotation saved successfully!", {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          style: {
            borderRadius: "10px",
            background: "#1e293b",
            color: "#fff",
          },
        });
        reset();
      }
    });
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

      <div className="mb-8">
        <h3 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Submit Annotation
        </h3>
        <p className="text-slate-500 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          Ref ID:{" "}
          <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded">
            {articleId}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
          >
            Your Question / Comment
          </label>
          <textarea
            id="question"
            rows={6}
            placeholder="Enter your legal inquiry or notation here... (min 10 characters)"
            className={`w-full px-5 py-4 rounded-xl border ${
              errors.question
                ? "border-red-400 focus:ring-red-200 bg-red-50"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100 bg-slate-50 focus:bg-white"
            } transition duration-300 ease-in-out focus:outline-none focus:ring-4 resize-none shadow-inner text-slate-800 text-lg`}
            {...register("question")}
            disabled={isPending}
          />
          {errors.question && (
            <p className="mt-3 text-sm text-red-500 font-semibold flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              {errors.question.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200 shadow-sm">
            Operation Failed: {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isSubmitting}
          className="w-full group relative flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-slate-900 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/30 overflow-hidden"
        >
          {isPending ? (
            <span className="flex items-center gap-3 z-10">
              <svg
                className="animate-spin h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-3 z-10">
              Submit & Next
              <Send className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          )}
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>
      </form>
    </div>
  );
}
