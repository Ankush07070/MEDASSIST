import { useEffect, useState } from "react";
import {
    FileText,
    CalendarDays,
    MessageCircle,
    Stethoscope,
} from "lucide-react";

import { getCurrentUser } from "../../api/users";
import { getReports } from "../../api/reports";
import { getDoctors } from "../../api/doctors";
import { getAppointments } from "../../api/appointments";


import StatCard from "../../components/StatCard";
import RecentReports from "../../components/RecentReports";
import UpcomingAppointment from "../../components/UpcomingAppointment";
import AIAssistant from "../../components/AIAssistant";

function Dashboard() {

    const [user, setUser] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const currentUser = await getCurrentUser();
                const reportsData = await getReports();
                const doctorsData = await getDoctors();
                const appointmentsData = await getAppointments();

                setUser(currentUser);
                setReports(reportsData);
                setDoctors(doctorsData);
                setAppointments(appointmentsData);

            } catch (error) {

                console.error("Dashboard Error:", error);

            }

        }

        loadDashboard();

    }, []);

    return (

        <div className="space-y-10">

            {/* Welcome */}

            <div>

                <h1 className="text-4xl font-bold text-slate-800">

                    Welcome Back, {user?.full_name || "Patient"} 👋

                </h1>

                <p className="text-slate-500 mt-2">

                    Your AI Healthcare Assistant is ready to help you today.

                </p>

            </div>

           

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Reports"
                    value={reports.length}
                    subtitle="Medical reports uploaded"
                    icon={FileText}
                    color="bg-blue-500"
                />

                <StatCard
                    title="Appointments"
                    value={appointments.length}
                    subtitle="Upcoming appointments"
                    icon={CalendarDays}
                    color="bg-green-500"
                />

                <StatCard
                    title="Doctors"
                    value={doctors.length}
                    subtitle="Available specialists"
                    icon={Stethoscope}
                    color="bg-purple-500"
                />

                <StatCard
                    title="AI Chats"
                    value={0}
                    subtitle="Health conversations"
                    icon={MessageCircle}
                    color="bg-pink-500"
                />

            </div>

            {/* Reports & Appointment */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                <RecentReports />

                <UpcomingAppointment />

            </div>

            {/* AI Assistant */}

            <AIAssistant />

        </div>

    );

}

export default Dashboard;