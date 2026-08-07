import { useEffect, useState } from "react";
import {
    FileText,
    Upload,
    Search,
} from "lucide-react";

import { getReports } from "../../api/reports";

function Reports() {

    const [reports, setReports] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadReports() {

            try {

                const data = await getReports();

                setReports(data);

            } catch (error) {

                console.error(error);

            }

        }

        loadReports();

    }, []);

    const filteredReports = reports.filter((report) =>
        report.file_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="space-y-8">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-4xl font-bold">

                        Medical Reports

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Manage all your uploaded reports.

                    </p>

                </div>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition">

                    <Upload size={20} />

                    Upload Report

                </button>

            </div>

            <div className="relative">

                <Search
                    className="absolute left-4 top-3 text-slate-400"
                    size={20}
                />

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search reports..."
                    className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {filteredReports.map((report) => (

                    <div
                        key={report.id}
                        className="bg-white rounded-2xl shadow p-6"
                    >

                        <div className="flex justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <FileText className="text-blue-600" />

                                    <h2 className="font-semibold text-lg">

                                        {report.file_name}

                                    </h2>

                                </div>

                                <p className="text-sm text-slate-500 mt-3">

                                    {report.report_type}

                                </p>

                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    report.processing_status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >

                                {report.processing_status}

                            </span>

                        </div>

                        <button className="mt-6 text-blue-600 font-medium">

                            View AI Summary →

                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default Reports;