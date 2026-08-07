import { useState } from "react";
import {
    X,
    Sparkles,
    FileText,
    Copy,
    Check,
    CalendarDays,
    ClipboardList,
} from "lucide-react";

interface ReportViewerProps {
    open: boolean;
    onClose: () => void;
    report: any;
}

function ReportViewer({
    open,
    onClose,
    report,
}: ReportViewerProps) {

    const [activeTab, setActiveTab] = useState<
        "summary" | "text" | "info"
    >("summary");

    const [copied, setCopied] = useState(false);

    if (!open || !report) {
        return null;
    }

    const summary =
        report.ai_summary ||
        "AI summary is not available for this report.";

    const extractedText =
        report.extracted_text ||
        "No extracted text is available.";

    const copySummary = async () => {

        try {

            await navigator.clipboard.writeText(summary);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Failed to copy summary:",
                error
            );

        }

    };

    return (

        <div className="fixed inset-0 z-50">

            {/* Backdrop */}

            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Drawer */}

            <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col">

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                    <div className="flex items-center gap-4 min-w-0">

                        <div className="bg-blue-100 p-3 rounded-2xl flex-shrink-0">

                            <FileText
                                size={24}
                                className="text-blue-600"
                            />

                        </div>

                        <div className="min-w-0">

                            <h2 className="font-bold text-lg text-slate-800 truncate">

                                {report.file_name}

                            </h2>

                            <p className="text-sm text-slate-500 mt-1">

                                AI Medical Report Analysis

                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 transition flex-shrink-0"
                    >

                        <X
                            size={22}
                            className="text-slate-500"
                        />

                    </button>

                </div>

                {/* Report Meta */}

                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">

                    <div className="flex flex-wrap gap-4 text-sm">

                        <div className="flex items-center gap-2 text-slate-500">

                            <CalendarDays size={16} />

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

                        <div className="flex items-center gap-2 text-slate-500">

                            <ClipboardList size={16} />

                            <span>

                                {report.report_type ||
                                    "Medical Report"}

                            </span>

                        </div>

                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs">

                            {report.processing_status}

                        </span>

                    </div>

                </div>

                {/* Tabs */}

                <div className="px-6 pt-4 border-b border-slate-200">

                    <div className="flex gap-6">

                        <button
                            onClick={() =>
                                setActiveTab("summary")
                            }
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab === "summary"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-slate-500 border-transparent hover:text-slate-800"
                            }`}
                        >

                            <span className="flex items-center gap-2">

                                <Sparkles size={16} />

                                AI Summary

                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveTab("text")
                            }
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab === "text"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-slate-500 border-transparent hover:text-slate-800"
                            }`}
                        >

                            <span className="flex items-center gap-2">

                                <FileText size={16} />

                                Extracted Text

                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveTab("info")
                            }
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab === "info"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-slate-500 border-transparent hover:text-slate-800"
                            }`}
                        >

                            Report Info

                        </button>

                    </div>

                </div>

                {/* Content */}

                <div className="flex-1 overflow-y-auto px-6 py-6">

                    {/* Summary */}

                    {activeTab === "summary" && (

                        <div className="space-y-5">

                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-3xl p-6">

                                <div className="flex items-center gap-3 mb-5">

                                    <div className="bg-white p-3 rounded-xl shadow-sm">

                                        <Sparkles
                                            size={22}
                                            className="text-purple-600"
                                        />

                                    </div>

                                    <div>

                                        <h3 className="font-bold text-slate-800">

                                            AI Medical Summary

                                        </h3>

                                        <p className="text-sm text-slate-500">

                                            Generated from your uploaded report

                                        </p>

                                    </div>

                                </div>

                                <div className="text-slate-700 leading-7 whitespace-pre-wrap text-sm">

                                    {summary}

                                </div>

                            </div>

                            <button
                                onClick={copySummary}
                                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium"
                            >

                                {copied ? (
                                    <>
                                        <Check
                                            size={17}
                                            className="text-green-600"
                                        />

                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={17} />

                                        Copy Summary
                                    </>
                                )}

                            </button>

                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">

                                <p className="text-xs text-amber-800 leading-5">

                                    <strong>Important:</strong>{" "}
                                    This AI-generated summary is for
                                    informational purposes only and
                                    should not replace professional
                                    medical advice.

                                </p>

                            </div>

                        </div>

                    )}

                    {/* Extracted Text */}

                    {activeTab === "text" && (

                        <div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                                <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap">

                                    {extractedText}

                                </p>

                            </div>

                        </div>

                    )}

                    {/* Info */}

                    {activeTab === "info" && (

                        <div className="space-y-4">

                            <div className="bg-slate-50 rounded-2xl p-5">

                                <p className="text-xs text-slate-400 uppercase tracking-wide">

                                    File Name

                                </p>

                                <p className="font-semibold text-slate-800 mt-2 break-all">

                                    {report.file_name}

                                </p>

                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5">

                                <p className="text-xs text-slate-400 uppercase tracking-wide">

                                    Report Type

                                </p>

                                <p className="font-semibold text-slate-800 mt-2">

                                    {report.report_type ||
                                        "Not specified"}

                                </p>

                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5">

                                <p className="text-xs text-slate-400 uppercase tracking-wide">

                                    Processing Status

                                </p>

                                <p className="font-semibold text-green-600 mt-2">

                                    {report.processing_status}

                                </p>

                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5">

                                <p className="text-xs text-slate-400 uppercase tracking-wide">

                                    Uploaded

                                </p>

                                <p className="font-semibold text-slate-800 mt-2">

                                    {new Date(
                                        report.created_at
                                    ).toLocaleString()}

                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default ReportViewer;