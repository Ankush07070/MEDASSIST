import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    Stethoscope,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAppointments } from "../api/appointments";
import { getDoctors } from "../api/doctors";

function UpcomingAppointment() {

    const navigate = useNavigate();

    const [appointment, setAppointment] = useState<any>(null);
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadUpcomingAppointment() {

            try {

                setLoading(true);

                const [appointments, doctors] =
                    await Promise.all([
                        getAppointments(),
                        getDoctors(),
                    ]);

                const now = new Date();

                const upcomingAppointments =
                    appointments
                        .filter(
                            (item: any) =>
                                item.status === "booked" &&
                                new Date(
                                    item.appointment_time
                                ) >= now
                        )
                        .sort(
                            (a: any, b: any) =>
                                new Date(
                                    a.appointment_time
                                ).getTime() -
                                new Date(
                                    b.appointment_time
                                ).getTime()
                        );

                const nextAppointment =
                    upcomingAppointments[0];

                setAppointment(nextAppointment || null);

                if (nextAppointment) {

                    const selectedDoctor =
                        doctors.find(
                            (item: any) =>
                                item.id ===
                                nextAppointment.doctor_id
                        );

                    setDoctor(
                        selectedDoctor || null
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load upcoming appointment:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }

        loadUpcomingAppointment();

    }, []);

    if (loading) {

        return (

            <div className="bg-white rounded-3xl shadow-md p-6 h-full">

                <h2 className="text-xl font-bold mb-6">
                    Upcoming Appointment
                </h2>

                <div className="bg-slate-50 rounded-2xl p-8 text-center">

                    <p className="text-slate-500">
                        Loading appointment...
                    </p>

                </div>

            </div>

        );

    }

    if (!appointment) {

        return (

            <div className="bg-white rounded-3xl shadow-md p-6 h-full">

                <h2 className="text-xl font-bold mb-6">
                    Upcoming Appointment
                </h2>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">

                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">

                        <CalendarDays
                            size={30}
                            className="text-blue-600"
                        />

                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mt-5">

                        No Upcoming Appointments

                    </h3>

                    <p className="text-slate-500 mt-2">

                        You don't have any upcoming doctor appointments.

                    </p>

                    <button
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                    >

                        Find a Doctor

                        <ArrowRight size={18} />

                    </button>

                </div>

            </div>

        );

    }

    const appointmentDate =
        new Date(
            appointment.appointment_time
        );

    return (

        <div className="bg-white rounded-3xl shadow-md p-6 h-full">

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold">

                    Upcoming Appointment

                </h2>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                    Booked

                </span>

            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white p-6">

                <div className="flex items-center gap-4">

                    <div className="bg-white/20 p-3 rounded-xl">

                        <Stethoscope size={26} />

                    </div>

                    <div>

                        <h3 className="text-2xl font-semibold">

                            {doctor
                                ? `Dr. ${doctor.full_name}`
                                : "Doctor Appointment"}

                        </h3>

                        {doctor?.specialization && (

                            <p className="opacity-90 mt-1">

                                {doctor.specialization}

                            </p>

                        )}

                    </div>

                </div>

                <div className="space-y-4 mt-6">

                    <div className="flex items-center gap-3">

                        <CalendarDays size={18} />

                        <span>

                            {appointmentDate.toLocaleDateString(
                                undefined,
                                {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}

                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <Clock size={18} />

                        <span>

                            {appointmentDate.toLocaleTimeString(
                                undefined,
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}

                        </span>

                    </div>

                    {appointment.reason && (

                        <div className="pt-3 border-t border-white/20">

                            <p className="text-xs opacity-75 uppercase tracking-wide">

                                Reason for Visit

                            </p>

                            <p className="mt-1">

                                {appointment.reason}

                            </p>

                        </div>

                    )}

                    {doctor?.hospital_id && (

                        <div className="flex items-center gap-3">

                            <MapPin size={18} />

                            <span>
                                Hospital consultation
                            </span>

                        </div>

                    )}

                </div>

                <button
                    onClick={() =>
                        navigate("/appointments")
                    }
                    className="w-full mt-6 bg-white/15 hover:bg-white/25 border border-white/20 py-3 rounded-xl font-semibold transition"
                >

                    View All Appointments

                </button>

            </div>

        </div>

    );

}

export default UpcomingAppointment;