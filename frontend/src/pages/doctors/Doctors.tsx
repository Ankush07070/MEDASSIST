import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Stethoscope,
    UserRound,
    IndianRupee,
    BriefcaseMedical,
    CalendarPlus,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import { getDoctors } from "../../api/doctors";

function Doctors() {

    const navigate = useNavigate();

    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);

    async function loadDoctors() {

        try {

            setLoading(true);

            const data = await getDoctors();

            setDoctors(data);

        } catch (error) {

            console.error(
                "Failed to load doctors:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadDoctors();

    }, []);

    const specializations = useMemo(() => {

        return Array.from(
            new Set(
                doctors
                    .map((doctor) => doctor.specialization)
                    .filter(Boolean)
            )
        );

    }, [doctors]);

    const filteredDoctors = useMemo(() => {

        return doctors.filter((doctor) => {

            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                doctor.full_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                doctor.specialization
                    ?.toLowerCase()
                    .includes(searchValue) ||
                doctor.qualification
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesSpecialization =
                !specialization ||
                doctor.specialization === specialization;

            const matchesAvailability =
                !availableOnly ||
                doctor.is_available;

            return (
                matchesSearch &&
                matchesSpecialization &&
                matchesAvailability
            );

        });

    }, [
        doctors,
        search,
        specialization,
        availableOnly,
    ]);

    function handleBookAppointment(
        doctorId: string
    ) {

        navigate(
            `/appointments/book?doctor_id=${doctorId}`
        );

    }

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[400px]">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-500 mt-4">
                        Finding available doctors...
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="bg-purple-100 p-3 rounded-2xl">

                        <Stethoscope
                            size={26}
                            className="text-purple-600"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">

                            Find a Doctor

                        </h1>

                        <p className="text-slate-500 mt-1">

                            Browse available specialists and book an appointment.

                        </p>

                    </div>

                </div>

            </div>

            {/* Search + Filters */}

            {doctors.length > 0 && (

                <div className="bg-white border border-slate-200 rounded-3xl p-5">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Search */}

                        <div className="lg:col-span-2 relative">

                            <Search
                                size={19}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by doctor, specialization or qualification..."
                                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                        </div>

                        {/* Specialization */}

                        <div className="relative">

                            <SlidersHorizontal
                                size={18}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <select
                                value={specialization}
                                onChange={(e) =>
                                    setSpecialization(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >

                                <option value="">
                                    All Specializations
                                </option>

                                {specializations.map(
                                    (item) => (

                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {/* Availability */}

                    <label className="flex items-center gap-3 mt-4 cursor-pointer w-fit">

                        <input
                            type="checkbox"
                            checked={availableOnly}
                            onChange={(e) =>
                                setAvailableOnly(
                                    e.target.checked
                                )
                            }
                            className="w-4 h-4 accent-purple-600"
                        />

                        <span className="text-sm font-medium text-slate-600">

                            Show available doctors only

                        </span>

                    </label>

                </div>

            )}

            {/* Results */}

            {doctors.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

                    <Stethoscope
                        size={52}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="text-xl font-bold text-slate-800 mt-5">

                        No Doctors Available

                    </h2>

                    <p className="text-slate-500 mt-2">

                        There are currently no doctors available.

                    </p>

                </div>

            ) : filteredDoctors.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

                    <Search
                        size={48}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="text-xl font-bold text-slate-800 mt-5">

                        No Doctors Found

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Try changing your search or filters.

                    </p>

                    <button
                        onClick={() => {

                            setSearch("");
                            setSpecialization("");
                            setAvailableOnly(false);

                        }}
                        className="mt-5 text-purple-600 font-semibold hover:text-purple-700"
                    >

                        Clear Filters

                    </button>

                </div>

            ) : (

                <>

                    <div className="flex items-center justify-between">

                        <p className="text-slate-500">

                            Showing{" "}
                            <span className="font-semibold text-slate-800">
                                {filteredDoctors.length}
                            </span>{" "}
                            doctor
                            {filteredDoctors.length !== 1
                                ? "s"
                                : ""}

                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {filteredDoctors.map((doctor) => (

                            <div
                                key={doctor.id}
                                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300"
                            >

                                {/* Doctor Header */}

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        <div className="bg-purple-100 p-4 rounded-2xl">

                                            <UserRound
                                                size={28}
                                                className="text-purple-600"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="font-bold text-lg text-slate-800">

                                                Dr.{" "}
                                                {doctor.full_name}

                                            </h2>

                                            <p className="text-purple-600 font-medium">

                                                {doctor.specialization}

                                            </p>

                                        </div>

                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            doctor.is_available
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >

                                        {doctor.is_available
                                            ? "Available"
                                            : "Unavailable"}

                                    </span>

                                </div>

                                {/* Details */}

                                <div className="space-y-3 mt-6">

                                    <div className="flex items-center gap-3 text-slate-600">

                                        <BriefcaseMedical
                                            size={18}
                                            className="text-slate-400"
                                        />

                                        <span>
                                            {doctor.qualification}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600">

                                        <Stethoscope
                                            size={18}
                                            className="text-slate-400"
                                        />

                                        <span>

                                            {doctor.experience}{" "}
                                            {doctor.experience === 1
                                                ? "year"
                                                : "years"}{" "}
                                            experience

                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600">

                                        <IndianRupee
                                            size={18}
                                            className="text-slate-400"
                                        />

                                        <span>

                                            Consultation Fee: ₹
                                            {doctor.consultation_fee}

                                        </span>

                                    </div>

                                </div>

                                {/* Action */}

                                <button
                                    disabled={
                                        !doctor.is_available
                                    }
                                    onClick={() =>
                                        handleBookAppointment(
                                            doctor.id
                                        )
                                    }
                                    className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                                        doctor.is_available
                                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                                >

                                    <CalendarPlus size={18} />

                                    {doctor.is_available
                                        ? "Book Appointment"
                                        : "Currently Unavailable"}

                                </button>

                            </div>

                        ))}

                    </div>

                </>

            )}

        </div>

    );

}

export default Doctors;