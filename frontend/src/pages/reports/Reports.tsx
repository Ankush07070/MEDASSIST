import { useEffect, useState } from "react";
import {
    FileText,
    Upload,
    Search,
    Sparkles,
    CalendarDays,
    ArrowRight,
} from "lucide-react";

import { getReports } from "../../api/reports";

import UploadReportModal from "../../components/UploadReportModal";
import ReportViewer from "../../components/ReportViewer";

function Reports() {

    const [reports, setReports] = useState<any[]>([]);

    const [search, setSearch] = useState("");

    const [openUploadModal, setOpenUploadModal] = useState(false);

    const [viewerOpen, setViewerOpen] = useState(false);

    const [selectedReport, setSelectedReport] = useState<any>(null);

    async function loadReports() {

        try {

            const data = await getReports();

            setReports(data);

        } catch (error) {

            console.error("Failed to load reports:", error);

        }

    }

    useEffect(() => {

        loadReports();

    }, []);

    const filteredReports = reports.filter((report) =>
        report.file_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    function openReport(report: any) {

        setSelectedReport(report);

        setViewerOpen(true);

    }

    return (

        <div className="space-y-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-100 p-3 rounded-2xl">

                            <FileText
                                size={26}
                                className="text-blue-600"
                            />

                        </div>

                        <div>

                            <h1 className="text-4xl font-bold text-slate-800">

                                Medical Reports

                            </h1>

                            <p className="text-slate-500 mt-1">

                                Your medical records, organized and enhanced with AI.

                            </p>

                        </div>

                    </div>

                </div>

                <button
                    onClick={() => setOpenUploadModal(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5"
                >

                    <Upload size={20} />

                    Upload Report

                </button>

            </div>

            {/* Search */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

                <div className="relative">

                    <Search
                        className="absolute left-4 top-3.5 text-slate-400"
                        size={20}
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search your medical reports..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                </div>

            </div>

            {/* Report Count */}

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-slate-500">

                        Showing

                        <span className="font-semibold text-slate-800 mx-1">

                            {filteredReports.length}

                        </span>

                        report
                        {filteredReports.length !== 1 ? "s" : ""}

                    </p>

                </div>

            </div>

            {/* Reports */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {filteredReports.length === 0 ? (

                    <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">

                        <div className="w-20 h-20 mx-auto bg-blue-50 rounded-3xl flex items-center justify-center">

                            <FileText
                                size={38}
                                className="text-blue-500"
                            />

                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 mt-6">

                            No Reports Found

                        </h2>

                        <p className="text-slate-500 mt-2 max-w-md mx-auto">

                            {search
                                ? "Try searching with a different report name."
                                : "Upload your first medical report and let MEDASSIST analyze it for you."
                            }

                        </p>

                        {!search && (

                            <button
                                onClick={() =>
                                    setOpenUploadModal(true)
                                }
                                className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
                            >

                                <Upload size={18} />

                                Upload Your First Report

                            </button>

                        )}

                    </div>

                ) : (

                    filteredReports.map((report) => {

                        const completed =
                            report.processing_status === "completed";

                        return (

                            <div
                                key={report.id}
                                className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >

                                <div className="p-6">

                                    {/* Top Section */}

                                    <div className="flex justify-between items-start gap-4">

                                        <div className="flex gap-4 min-w-0">

                                            <div className="flex-shrink-0 bg-blue-100 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">

                                                <FileText
                                                    size={27}
                                                    className="text-blue-600 group-hover:text-white transition-colors duration-300"
                                                />

                                            </div>

                                            <div className="min-w-0">

                                                <h2 className="font-bold text-lg text-slate-800 break-words">

                                                    {report.file_name}

                                                </h2>

                                                <p className="text-sm text-slate-500 mt-1">

                                                    {report.report_type || "Medical Report"}

                                                </p>

                                            </div>

                                        </div>

                                        {/* Status */}

                                        <span
                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                completed
                                                    ? "bg-green-100 text-green-700"
                                                    : report.processing_status === "failed"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >

                                            {completed
                                                ? "Completed"
                                                : report.processing_status === "failed"
                                                ? "Failed"
                                                : "Processing"
                                            }

                                        </span>

                                    </div>

                                    {/* Metadata */}

                                    <div className="flex items-center gap-2 mt-5 text-sm text-slate-400">

                                        <CalendarDays size={16} />

                                        <span>

                                            Uploaded{" "}

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

                                    {/* AI Status */}

                                    <div className="mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`p-2 rounded-xl ${
                                                    completed
                                                        ? "bg-purple-100"
                                                        : "bg-yellow-100"
                                                }`}
                                            >

                                                <Sparkles
                                                    size={18}
                                                    className={
                                                        completed
                                                            ? "text-purple-600"
                                                            : "text-yellow-600"
                                                    }
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">

                                                    AI Analysis

                                                </p>

                                                <p className="font-semibold text-slate-800 mt-0.5">

                                                    {completed
                                                        ? "AI Summary Ready"
                                                        : "Analyzing Report..."
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Actions */}

                                    <div className="flex gap-3 mt-6">

                                        <button
                                            disabled={!completed}
                                            onClick={() =>
                                                openReport(report)
                                            }
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                                                completed
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            }`}
                                        >

                                            <Sparkles size={18} />

                                            {completed
                                                ? "View AI Summary"
                                                : "Processing..."
                                            }

                                            {completed && (
                                                <ArrowRight size={17} />
                                            )}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                )}

            </div>

            {/* Upload Modal */}

            <UploadReportModal
                open={openUploadModal}
                onClose={() =>
                    setOpenUploadModal(false)
                }
                onUploadSuccess={loadReports}
            />

            {/* Report Viewer */}

            <ReportViewer
                open={viewerOpen}
                onClose={() =>
                    setViewerOpen(false)
                }
                report={selectedReport}
            />

        </div>

    );

}

export default Reports;