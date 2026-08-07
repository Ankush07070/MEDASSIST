import { useRef, useState } from "react";
import {
    Upload,
    X,
    FileText,
} from "lucide-react";

import { uploadReport } from "../api/upload";

interface Props {
    open: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

function UploadReportModal({
    open,
    onClose,
    onUploadSuccess,
}: Props) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    async function handleUpload() {

        if (!file) return;

        try {

            setLoading(true);

            await uploadReport(file);

            onUploadSuccess();

            onClose();

            setFile(null);

        } catch (error) {

            console.error(error);

            alert("Upload failed.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-[500px] p-8 shadow-2xl">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">

                        Upload Medical Report

                    </h2>

                    <button onClick={onClose}>

                        <X />

                    </button>

                </div>

                <div
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    className="border-2 border-dashed border-blue-400 rounded-2xl p-10 text-center cursor-pointer hover:bg-blue-50 transition"
                >

                    <Upload
                        size={42}
                        className="mx-auto text-blue-600"
                    />

                    <p className="mt-4 font-semibold">

                        Click to choose a PDF

                    </p>

                    <p className="text-sm text-slate-500 mt-2">

                        PDF only

                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        hidden
                        onChange={(e) => {

                            if (
                                e.target.files &&
                                e.target.files.length > 0
                            ) {

                                setFile(
                                    e.target.files[0]
                                );

                            }

                        }}
                    />

                </div>

                {file && (

                    <div className="mt-6 flex items-center gap-3 bg-slate-100 rounded-xl p-4">

                        <FileText className="text-blue-600" />

                        <div>

                            <p className="font-medium">

                                {file.name}

                            </p>

                            <p className="text-sm text-slate-500">

                                {(file.size / 1024).toFixed(1)} KB

                            </p>

                        </div>

                    </div>

                )}

                <button
                    disabled={!file || loading}
                    onClick={handleUpload}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl disabled:opacity-50"
                >

                    {loading
                        ? "Uploading..."
                        : "Upload Report"}

                </button>

            </div>

        </div>

    );

}

export default UploadReportModal;