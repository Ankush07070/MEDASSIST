import {
    LayoutDashboard,
    FileText,
    CalendarDays,
    Building2,
    Stethoscope,
    Bot,
    LogOut,
    HeartPulse,
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

function MainLayout() {

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        navigate("/login");

    }

    const menuItems = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },

        {
            name: "Reports",
            path: "/reports",
            icon: FileText,
        },

        {
            name: "Appointments",
            path: "/appointments",
            icon: CalendarDays,
        },

        {
            name: "Doctors",
            path: "/doctors",
            icon: Stethoscope,
        },

        {
            name: "Hospitals",
            path: "/hospitals",
            icon: Building2,
        },

        {
            name: "AI Assistant",
            path: "/chat",
            icon: Bot,
        },

    ];

    return (

        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}

            <aside className="w-72 bg-slate-900 text-white flex flex-col">

                <div className="p-8 border-b border-slate-800">

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-600 p-3 rounded-xl">

                            <HeartPulse size={26} />

                        </div>

                        <div>

                            <h1 className="text-2xl font-bold">

                                MEDASSIST

                            </h1>

                            <p className="text-slate-400 text-sm">

                                AI Healthcare

                            </p>

                        </div>

                    </div>

                </div>

                <nav className="flex-1 p-5 space-y-2">

                    {

                        menuItems.map((item) => {

                            const Icon = item.icon;

                            return (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>

                                        `flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
                                            isActive
                                                ? "bg-blue-600"
                                                : "hover:bg-slate-800"
                                        }`

                                    }
                                >

                                    <Icon size={20} />

                                    {item.name}

                                </NavLink>

                            );

                        })

                    }

                </nav>

                <div className="p-5">

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full justify-center bg-red-500 hover:bg-red-600 py-3 rounded-xl transition"
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </aside>

            {/* Main Content */}

            <main className="flex-1 overflow-y-auto p-10">

                <Outlet />

            </main>

        </div>

    );

}

export default MainLayout;