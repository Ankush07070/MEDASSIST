import {
    LayoutDashboard,
    FileText,
    MessageCircle,
    CalendarDays,
    UserRound,
    Building2,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import Logo from "./Logo";

function Sidebar() {

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem("access_token");

        navigate("/login");

    }

    return (

        <aside className="w-72 h-screen bg-white/70 backdrop-blur-xl border-r border-white shadow-xl flex flex-col">

            {/* Logo */}

            <div className="p-8">

                <Logo />

            </div>

            {/* Navigation */}

            <nav className="flex-1 px-4">

                <SidebarItem
                    icon={<LayoutDashboard size={20} />}
                    title="Dashboard"
                    to="/dashboard"
                />

                <SidebarItem
                    icon={<FileText size={20} />}
                    title="Reports"
                    to="/reports"
                />

                <SidebarItem
                    icon={<MessageCircle size={20} />}
                    title="AI Chat"
                    to="/chat"
                />

                <SidebarItem
                    icon={<CalendarDays size={20} />}
                    title="Appointments"
                    to="/appointments"
                />

                <SidebarItem
                    icon={<UserRound size={20} />}
                    title="Doctors"
                    to="/doctors"
                />

                <SidebarItem
                    icon={<Building2 size={20} />}
                    title="Hospitals"
                    to="/hospitals"
                />

            </nav>

            {/* Logout */}

            <div className="p-5">

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-xl p-3 w-full transition"
                >

                    <LogOut size={20} />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

}

function SidebarItem({
    icon,
    title,
    to,
}: {
    icon: React.ReactNode;
    title: string;
    to: string;
}) {

    return (

        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-4 w-full rounded-2xl p-4 mb-2 transition-all duration-300 ${
                    isActive
                        ? "bg-indigo-100 text-indigo-600 shadow-sm"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`
            }
        >

            {icon}

            <span className="font-medium">
                {title}
            </span>

        </NavLink>

    );

}

export default Sidebar;