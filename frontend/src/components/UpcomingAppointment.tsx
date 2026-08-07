import { CalendarDays, Clock, MapPin } from "lucide-react";

function UpcomingAppointment() {
    return (
        <div className="bg-white rounded-3xl shadow-md p-6 h-full">

            <h2 className="text-xl font-bold mb-6">
                Upcoming Appointment
            </h2>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white p-6">

                <h3 className="text-2xl font-semibold">
                    Dr. Raj Sharma
                </h3>

                <p className="opacity-90 mt-1">
                    Cardiologist
                </p>

                <div className="space-y-3 mt-6">

                    <div className="flex items-center gap-3">

                        <CalendarDays size={18} />

                        <span>
                            Tomorrow
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <Clock size={18} />

                        <span>
                            11:30 AM
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <MapPin size={18} />

                        <span>
                            AIIMS Delhi
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default UpcomingAppointment;