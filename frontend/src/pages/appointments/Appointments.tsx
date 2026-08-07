import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    UserRound,
    XCircle,
    Stethoscope,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getAppointments,
    cancelAppointment,
} from "../../api/appointments";

function Appointments() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);

    async function loadAppointments() {

        try {

            setLoading(true);

            const data = await getAppointments();

            setAppointments(data);

        } catch (error) {

            console.error(
                "Failed to load appointments:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadAppointments();

    }, []);

    async function handleCancel(id: string) {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancelling(id);

            await cancelAppointment(id);

            await loadAppointments();

        } catch (error) {

            console.error(
                "Failed to cancel appointment:",
                error
            );

            alert("Unable to cancel appointment.");

        } finally {

            setCancelling(null);

        }

    }

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[400px]">

                <p className="text-slate-500">
                    Loading appointments...
                </p>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="bg-green-100 p-3 rounded-2xl">

                        <CalendarDays
                            size={26}
                            className="text-green-600"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">
                            My Appointments
                        </h1>

                        <p className="text-slate-500 mt-1">
                            View and manage your upcoming healthcare appointments.
                        </p>

                    </div>

                </div>

            </div>

            {/* Empty State */}

            {appointments.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">

                        <CalendarDays
                            size={40}
                            className="text-blue-500"
                        />

                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">

                        No Appointments Yet

                    </h2>

                    <p className="text-slate-500 max-w-md mx-auto mt-3">

                        You don't have any appointments scheduled.
                        Find a doctor and book your first consultation.

                    </p>

                    <button
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="mt-7 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >

                        <Stethoscope size={19} />

                        Find a Doctor

                        <ArrowRight size={18} />

                    </button>

                </div>

            ) : (

                <>

                    {/* Appointment List */}

                    <div className="space-y-5">

                        {appointments.map((appointment) => {

                            const appointmentDate =
                                new Date(
                                    appointment.appointment_time
                                );

                            const isBooked =
                                appointment.status === "booked";

                            return (

                                <div
                                    key={appointment.id}
                                    className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition"
                                >

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                        <div className="flex items-start gap-4">

                                            <div className="bg-blue-100 p-4 rounded-2xl">

                                                <UserRound
                                                    size={25}
                                                    className="text-blue-600"
                                                />

                                            </div>

                                            <div>

                                                <h2 className="text-xl font-bold text-slate-800">

                                                    Doctor Appointment

                                                </h2>

                                                <p className="text-slate-500 mt-1">

                                                    Doctor ID:{" "}
                                                    {appointment.doctor_id}

                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className={`w-fit px-4 py-2 rounded-full text-sm font-semibold ${
                                                isBooked
                                                    ? "bg-green-100 text-green-700"
                                                    : appointment.status === "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                        >

                                            {appointment.status}

                                        </span>

                                    </div>

                                    {/* Date + Time */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                                        <div className="bg-slate-50 rounded-2xl p-4">

                                            <div className="flex items-center gap-2 text-slate-500">

                                                <CalendarDays size={18} />

                                                <span className="text-sm">
                                                    Date
                                                </span>

                                            </div>

                                            <p className="font-semibold text-slate-800 mt-2">

                                                {appointmentDate.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}

                                            </p>

                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4">

                                            <div className="flex items-center gap-2 text-slate-500">

                                                <Clock size={18} />

                                                <span className="text-sm">
                                                    Time
                                                </span>

                                            </div>

                                            <p className="font-semibold text-slate-800 mt-2">

                                                {appointmentDate.toLocaleTimeString(
                                                    undefined,
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}

                                            </p>

                                        </div>

                                    </div>

                                    {/* Reason */}

                                    {appointment.reason && (

                                        <div className="mt-4 bg-blue-50 rounded-2xl p-4">

                                            <p className="text-sm text-blue-600 font-semibold">
                                                Reason
                                            </p>

                                            <p className="text-slate-700 mt-1">
                                                {appointment.reason}
                                            </p>

                                        </div>

                                    )}

                                    {/* Cancel */}

                                    {isBooked && (

                                        <button
                                            onClick={() =>
                                                handleCancel(
                                                    appointment.id
                                                )
                                            }
                                            disabled={
                                                cancelling ===
                                                appointment.id
                                            }
                                            className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                        >

                                            <XCircle size={18} />

                                            {cancelling === appointment.id
                                                ? "Cancelling..."
                                                : "Cancel Appointment"}

                                        </button>

                                    )}

                                </div>

                            );

                        })}

                    </div>

                    {/* Additional Appointment CTA */}

                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">

                        <div>

                            <h3 className="font-bold text-slate-800 text-lg">

                                Need another consultation?

                            </h3>

                            <p className="text-sm text-slate-500 mt-1">

                                Find another specialist and book a new appointment.

                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/doctors")
                            }
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition whitespace-nowrap"
                        >

                            <Stethoscope size={18} />

                            Find a Doctor

                            <ArrowRight size={17} />

                        </button>

                    </div>

                </>

            )}

        </div>

    );

}

export default Appointments;