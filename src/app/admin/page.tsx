import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getStats } from "@/app/actions/admin";
import AdminControls from "@/components/AdminControls";
import { FileText, CheckCircle2, Trophy, Users, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stats = await getStats();
  const completionRate =
    stats.totalArticles > 0
      ? Math.round((stats.completedArticles / stats.totalArticles) * 100)
      : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Admin Workspace
          </h1>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Role: Admin
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">
                  Total Articles
                </p>
                <h3 className="text-4xl font-black text-slate-800">
                  {stats.totalArticles}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">
                  Completed
                </p>
                <h3 className="text-4xl font-black text-emerald-600">
                  {stats.completedArticles}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">
                  Progress
                </p>
                <h3 className="text-4xl font-black text-indigo-600">
                  {completionRate}%
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <AdminControls />

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Annotation
              Leaderboard
            </h3>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100">
            {stats.leaderboard.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic">
                No annotations completed yet.
              </div>
            ) : (
              stats.leaderboard.map((user: any, index: number) => (
                <div
                  key={user.email}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                          : index === 1
                            ? "bg-slate-200 text-slate-700 ring-2 ring-slate-300"
                            : index === 2
                              ? "bg-orange-100 text-orange-800 ring-2 ring-orange-200"
                              : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {user.email}
                      </p>
                      <p className="text-xs text-slate-500">Annotator</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900">
                      {user._count.annotations}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      Docs
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
