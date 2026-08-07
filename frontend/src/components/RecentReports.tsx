import {
    FileText,
    ChevronRight,
} from "lucide-react";

const reports = [
    "Complete Blood Count",
    "MRI Brain",
    "Chest X-Ray",
    "Blood Sugar",
];

function RecentReports() {

    return (

        <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-bold">

                    Recent Reports

                </h2>

                <button className="text-blue-600 flex items-center gap-1">

                    View All

                    <ChevronRight size={18} />

                </button>

            </div>

            <div className="space-y-4">

                {reports.map((report) => (

                    <div
                        key={report}
                        className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50 transition"
                    >

                        <div className="flex items-center gap-3">

                            <div className="bg-blue-100 p-3 rounded-xl">

                                <FileText className="text-blue-600"/>

                            </div>

                            <div>

                                <h3 className="font-semibold">

                                    {report}

                                </h3>

                                <p className="text-sm text-slate-500">

                                    Uploaded recently

                                </p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default RecentReports;