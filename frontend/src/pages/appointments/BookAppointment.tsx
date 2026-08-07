import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Stethoscope,
    UserRound,
    IndianRupee,
} from "lucide-react";

import { getDoctors } from "../../api/doctors";
import { bookAppointment } from "../../api/appointments";

function BookAppointment() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Accept both:
    // /appointments/book?doctor=ID
    // /appointments/book?doctor_id=ID
    const doctorId =
        searchParams.get("doctor_id") ||
        searchParams.get("doctor");

    const [doctor, setDoctor] = useState<any>(null);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {

        async function loadDoctor() {

            try {

                if (!doctorId) {
                    setLoading(false);
                    return;
                }

                const doctors = await getDoctors();

                const selectedDoctor = doctors.find(
                    (item: any) =>
                        item.id === doctorId
                );

                setDoctor(selectedDoctor);

            } catch (error) {

                console.error(
                    "Failed to load doctor:",
                    error
                );

                setDoctor(null);

            } finally {

                setLoading(false);

            }

        }

        loadDoctor();

    }, [doctorId]);

    async function handleBooking(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!doctorId) {

            alert("Doctor not selected.");

            return;

        }

        if (!date || !time) {

            alert(
                "Please select appointment date and time."
            );

            return;

        }

        try {

            setBooking(true);

            const appointmentTime =
                new Date(
                    `${date}T${time}`
                ).toISOString();

            await bookAppointment({

                doctor_id: doctorId,

                appointment_time:
                    appointmentTime,

                reason: reason.trim(),

            });

            alert(
                "Appointment booked successfully!"
            );

            navigate("/appointments");

        } catch (error: any) {

            console.error(
                "Booking failed:",
                error
            );

            const message =
                error?.response?.data?.detail ||
                "Unable to book appointment.";

            alert(message);

        } finally {

            setBooking(false);

        }

    }

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[400px]">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-500 mt-4">
                        Loading doctor...
                    </p>

                </div>

            </div>

        );

    }

    if (!doctor) {

        return (

            <div className="max-w-xl mx-auto">

                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

                    <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">

                        <Stethoscope
                            size={40}
                            className="text-slate-400"
                        />

                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">

                        Doctor Not Found

                    </h2>

                    <p className="text-slate-500 mt-2">

                        We couldn't find the selected doctor.
                        Please choose a doctor again.

                    </p>

                    <button
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >

                        Back to Doctors

                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className="max-w-4xl mx-auto space-y-8">

            {/* Back */}

            <button
                onClick={() =>
                    navigate("/doctors")
                }
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition"
            >

                <ArrowLeft size={18} />

                Back to Doctors

            </button>

            {/* Header */}

            <div>

                <h1 className="text-4xl font-bold text-slate-800">

                    Book Appointment

                </h1>

                <p className="text-slate-500 mt-2">

                    Choose a convenient date and time for
                    your consultation.

                </p>

            </div>

            {/* Doctor Information */}

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                <div className="flex items-center gap-5">

                    <div className="bg-purple-100 p-5 rounded-2xl">

                        <UserRound
                            size={32}
                            className="text-purple-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">

                            Dr. {doctor.full_name}

                        </h2>

                        <p className="text-purple-600 font-medium mt-1">

                            {doctor.specialization}

                        </p>

                        <p className="text-slate-500 mt-1">

                            {doctor.qualification}

                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                    <div className="bg-slate-50 rounded-2xl p-4">

                        <div className="flex items-center gap-2 text-slate-500">

                            <Stethoscope size={18} />

                            <span className="text-sm">
                                Experience
                            </span>

                        </div>

                        <p className="font-semibold text-slate-800 mt-2">

                            {doctor.experience} years

                        </p>

                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">

                        <div className="flex items-center gap-2 text-slate-500">

                            <IndianRupee size={18} />

                            <span className="text-sm">
                                Consultation Fee
                            </span>

                        </div>

                        <p className="font-semibold text-slate-800 mt-2">

                            ₹{doctor.consultation_fee}

                        </p>

                    </div>

                </div>

            </div>

            {/* Booking Form */}

            <form
                onSubmit={handleBooking}
                className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm"
            >

                <div>

                    <h2 className="text-xl font-bold text-slate-800">

                        Appointment Details

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Select when you'd like to meet the doctor.

                    </p>

                </div>

                {/* Date + Time */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                            Appointment Date

                        </label>

                        <div className="relative">

                            <CalendarDays
                                size={19}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <input
                                type="date"
                                value={date}
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                required
                                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                            Appointment Time

                        </label>

                        <div className="relative">

                            <Clock
                                size={19}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <input
                                type="time"
                                value={time}
                                onChange={(e) =>
                                    setTime(e.target.value)
                                }
                                required
                                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                </div>

                {/* Reason */}

                <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">

                        Reason for Visit

                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) =>
                            setReason(e.target.value)
                        }
                        placeholder="Briefly describe your symptoms or reason for consultation..."
                        rows={5}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                {/* Submit */}

                <button
                    type="submit"
                    disabled={booking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >

                    {booking
                        ? "Booking Appointment..."
                        : "Confirm Appointment"}

                </button>

            </form>

        </div>

    );

}

export default BookAppointment;