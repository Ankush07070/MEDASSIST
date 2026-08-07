import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Building2,
    MapPin,
    Phone,
    Mail,
    Stethoscope,
    CalendarPlus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getHospital } from "../../api/hospitals";
import { getDoctors } from "../../api/doctors";

function HospitalDetails() {

    const { hospitalId } = useParams();
    const navigate = useNavigate();

    const [hospital, setHospital] = useState<any>(null);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadHospital() {

            console.log("Hospital ID:", hospitalId);

            if (!hospitalId) {

                setError("Hospital ID is missing.");
                setLoading(false);

                return;
            }

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Requesting hospital:",
                    hospitalId
                );

                const hospitalData =
                    await getHospital(hospitalId);

                console.log(
                    "Hospital response:",
                    hospitalData
                );

                setHospital(hospitalData);

                const doctorsData =
                    await getDoctors();

                console.log(
                    "Doctors response:",
                    doctorsData
                );

                const hospitalDoctors =
                    doctorsData.filter(
                        (doctor: any) =>
                            doctor.hospital_id === hospitalId &&
                            doctor.is_available
                    );

                console.log(
                    "Hospital doctors:",
                    hospitalDoctors
                );

                setDoctors(hospitalDoctors);

            } catch (error: any) {

                console.error(
                    "Hospital loading error:",
                    error
                );

                console.error(
                    "Response:",
                    error?.response
                );

                console.error(
                    "Response data:",
                    error?.response?.data
                );

                setError(
                    error?.response?.data?.detail ||
                    "Failed to load hospital."
                );

            } finally {

                setLoading(false);

            }

        }

        loadHospital();

    }, [hospitalId]);

    if (loading) {

        return (

            <div className="flex flex-col items-center justify-center min-h-[400px]">

                <Building2
                    size={50}
                    className="text-blue-500 animate-pulse"
                />

                <p className="text-slate-500 mt-4">
                    Loading hospital...
                </p>

            </div>

        );

    }

    if (error) {

        return (

            <div className="space-y-5">

                <button
                    onClick={() =>
                        navigate("/hospitals")
                    }
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600"
                >

                    <ArrowLeft size={20} />

                    Back to Hospitals

                </button>

                <div className="bg-red-50 border border-red-200 rounded-3xl p-10 text-center">

                    <Building2
                        size={50}
                        className="mx-auto text-red-400"
                    />

                    <h2 className="text-2xl font-bold text-red-700 mt-5">

                        Unable to Load Hospital

                    </h2>

                    <p className="text-red-600 mt-2">

                        {error}

                    </p>

                    <p className="text-xs text-slate-500 mt-4 break-all">

                        Hospital ID: {hospitalId || "missing"}

                    </p>

                </div>

            </div>

        );

    }

    if (!hospital) {

        return (

            <div className="text-center py-20">

                <Building2
                    size={55}
                    className="mx-auto text-slate-300"
                />

                <h2 className="text-2xl font-bold mt-5">

                    Hospital Not Found

                </h2>

                <button
                    onClick={() =>
                        navigate("/hospitals")
                    }
                    className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl"
                >

                    Back to Hospitals

                </button>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <button
                onClick={() =>
                    navigate("/hospitals")
                }
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition"
            >

                <ArrowLeft size={20} />

                Back to Hospitals

            </button>

            {/* Hospital */}

            <div className="bg-white border border-slate-200 rounded-3xl p-8">

                <div className="flex flex-col md:flex-row gap-6">

                    <div className="bg-blue-100 p-5 rounded-3xl w-fit">

                        <Building2
                            size={42}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">

                            {hospital.name}

                        </h1>

                        <div className="mt-4 space-y-3 text-slate-600">

                            <div className="flex items-start gap-3">

                                <MapPin
                                    size={19}
                                    className="text-blue-600 mt-0.5"
                                />

                                <span>

                                    {hospital.address},{" "}
                                    {hospital.city},{" "}
                                    {hospital.state}

                                </span>

                            </div>

                            {hospital.phone && (

                                <div className="flex items-center gap-3">

                                    <Phone
                                        size={19}
                                        className="text-blue-600"
                                    />

                                    <span>
                                        {hospital.phone}
                                    </span>

                                </div>

                            )}

                            {hospital.email && (

                                <div className="flex items-center gap-3">

                                    <Mail
                                        size={19}
                                        className="text-blue-600"
                                    />

                                    <span>
                                        {hospital.email}
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* Doctors */}

            <div>

                <div className="flex items-center gap-3 mb-5">

                    <Stethoscope
                        size={28}
                        className="text-blue-600"
                    />

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">

                            Available Doctors

                        </h2>

                        <p className="text-slate-500">

                            Choose a doctor and book your appointment.

                        </p>

                    </div>

                </div>

                {doctors.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">

                        <Stethoscope
                            size={50}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="text-xl font-bold mt-4">

                            No Doctors Available

                        </h3>

                        <p className="text-slate-500 mt-2">

                            There are currently no available doctors at this hospital.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {doctors.map((doctor) => (

                            <div
                                key={doctor.id}
                                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition"
                            >

                                <div className="flex items-start gap-4">

                                    <div className="bg-purple-100 p-4 rounded-2xl">

                                        <Stethoscope
                                            size={28}
                                            className="text-purple-600"
                                        />

                                    </div>

                                    <div>

                                        <h3 className="text-xl font-bold text-slate-800">

                                            Dr. {doctor.full_name}

                                        </h3>

                                        <p className="text-blue-600 font-medium mt-1">

                                            {doctor.specialization}

                                        </p>

                                    </div>

                                </div>

                                <div className="mt-5 space-y-2 text-sm text-slate-600">

                                    <p>
                                        <strong>Qualification:</strong>{" "}
                                        {doctor.qualification}
                                    </p>

                                    <p>
                                        <strong>Experience:</strong>{" "}
                                        {doctor.experience} years
                                    </p>

                                    <p>
                                        <strong>Consultation Fee:</strong>{" "}
                                        ₹{doctor.consultation_fee}
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/appointments/book?doctor_id=${doctor.id}`
                                        )
                                    }
                                    className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                                >

                                    <CalendarPlus size={19} />

                                    Book Appointment

                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default HospitalDetails;