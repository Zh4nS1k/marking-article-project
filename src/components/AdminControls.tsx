"use client";

import { useState, useTransition } from "react";
import { uploadArticles, exportAnnotations } from "@/app/actions/admin";
import * as xlsx from "xlsx";
import toast from "react-hot-toast";
import { Upload, Download, FileJson, FileSpreadsheet } from "lucide-react";

export default function AdminControls() {
  const [isPending, startTransition] = useTransition();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        let articles: { id: string; content: string }[] = [];

        if (file.name.endsWith(".json")) {
          articles = JSON.parse(data as string);
        } else {
          const workbook = xlsx.read(data, { type: "binary" });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const json = xlsx.utils.sheet_to_json(worksheet) as any[];

          articles = json
            .map((row) => ({
              id: row.id || row.ID || row.Id,
              content:
                row.content ||
                row.Content ||
                row.CONTENT ||
                row.text ||
                row.Text,
            }))
            .filter((a) => a.id && a.content);
        }

        if (articles.length === 0) {
          toast.error(
            'No valid articles found. Ensure columns "id" and "content" exist.',
          );
          return;
        }

        startTransition(async () => {
          const res = await uploadArticles(articles);
          if (res.error) toast.error(res.error);
          else toast.success(`Successfully uploaded ${res.count} articles!`);
        });
      } catch (err) {
        toast.error("Failed to parse file.");
      }
    };

    if (file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }

    // reset input
    e.target.value = "";
  };

  const handleExport = async () => {
    startTransition(async () => {
      try {
        const data = await exportAnnotations();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `annotations-export-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Export started!");
      } catch (e) {
        toast.error("Export failed");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Upload Card */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" /> Bulk Import Articles
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Upload a .xlsx, .xls, or .json file containing 'id' and 'content'
          columns.
        </p>

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            {isPending ? (
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
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
            ) : (
              <>
                <FileSpreadsheet className="w-8 h-8 text-slate-400 mb-2" />
                <p className="mb-1 text-sm text-slate-600">
                  <span className="font-semibold text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  Supported: XLSX, XLS, JSON
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".xlsx, .xls, .json"
            onChange={handleFileUpload}
            disabled={isPending}
          />
        </label>
      </div>

      {/* Export Card */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Download className="w-5 h-5 text-emerald-600" /> Export Results
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Download a complete JSON file of all completed annotations matched
            with their source article text and the reviewer ID.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-4 rounded-xl hover:bg-slate-800 transition-all font-semibold disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isPending ? "Processing..." : "Download JSON Export"}
          <FileJson className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
