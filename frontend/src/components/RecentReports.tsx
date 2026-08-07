import { useEffect, useState } from "react";
import {
    FileText,
    ChevronRight,
    Sparkles,
    CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getReports } from "../api/reports";

function RecentReports() {

    const navigate = useNavigate();

    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadReports() {

            try {

                const data = await getReports();

                // Show only the latest 4 reports
                const recentReports = [...data]
                    .sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    )
                    .slice(0, 4);

                setReports(recentReports);

            } catch (error) {

                console.error(
                    "Failed to load recent reports:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }

        loadReports();

    }, []);

    return (

        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-xl font-bold text-slate-800">

                        Recent Reports

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Your latest medical reports

                    </p>

                </div>

                <button
                    onClick={() => navigate("/reports")}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium transition"
                >

                    View All

                    <ChevronRight size={18} />

                </button>

            </div>

            {/* Loading */}

            {loading ? (

                <div className="space-y-4">

                    {[1, 2, 3].map((item) => (

                        <div
                            key={item}
                            className="animate-pulse flex items-center gap-4 border border-slate-100 rounded-2xl p-4"
                        >

                            <div className="w-12 h-12 bg-slate-200 rounded-xl" />

                            <div className="flex-1 space-y-2">

                                <div className="h-4 bg-slate-200 rounded w-2/3" />

                                <div className="h-3 bg-slate-200 rounded w-1/3" />

                            </div>

                        </div>

                    ))}

                </div>

            ) : reports.length === 0 ? (

                /* Empty State */

                <div className="text-center py-10">

                    <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center">

                        <FileText
                            size={30}
                            className="text-blue-500"
                        />

                    </div>

                    <h3 className="font-semibold text-slate-800 mt-4">

                        No reports yet

                    </h3>

                    <p className="text-sm text-slate-500 mt-1">

                        Upload a medical report to see it here.

                    </p>

                    <button
                        onClick={() => navigate("/reports")}
                        className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                    >

                        Upload Report →

                    </button>

                </div>

            ) : (

                /* Reports */

                <div className="space-y-4">

                    {reports.map((report) => {

                        const completed =
                            report.processing_status === "completed";

                        return (

                            <div
                                key={report.id}
                                className="flex items-center justify-between border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 hover:border-blue-100 transition"
                            >

                                <div className="flex items-center gap-4 min-w-0">

                                    <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">

                                        <FileText
                                            size={22}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="font-semibold text-slate-800 truncate">

                                            {report.file_name}

                                        </h3>

                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">

                                            <CalendarDays size={13} />

                                            <span>

                                                {new Date(
                                                    report.created_at
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <div className="flex items-center gap-3 ml-4">

                                    <span
                                        className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                            completed
                                                ? "bg-green-100 text-green-700"
                                                : report.processing_status ===
                                                  "failed"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >

                                        {completed && (
                                            <Sparkles size={12} />
                                        )}

                                        {completed
                                            ? "Completed"
                                            : report.processing_status ===
                                              "failed"
                                            ? "Failed"
                                            : "Processing"}

                                    </span>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}

export default RecentReports;