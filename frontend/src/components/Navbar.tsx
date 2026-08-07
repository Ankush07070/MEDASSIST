import {
    Bell,
    Search,
} from "lucide-react";

function Navbar() {

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning ☀️"
            : hour < 18
            ? "Good Afternoon 🌤️"
            : "Good Evening 🌙";

    const today = new Date().toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    return (

        <header className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between">

            <div>

                <h2 className="text-3xl font-bold text-slate-800">

                    {greeting}

                </h2>

                <p className="text-slate-500 mt-1">

                    {today}

                </p>

            </div>

            <div className="flex items-center gap-5">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-4 top-3 text-slate-400"
                    />

                    <input
                        placeholder="Search reports, doctors..."
                        className="pl-11 pr-4 py-3 rounded-xl border border-slate-200 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                </div>

                <button className="relative bg-slate-100 p-3 rounded-xl hover:bg-indigo-100 transition">

                    <Bell size={22}/>

                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>

                </button>

                <div className="flex items-center gap-3">

                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold">

                        A

                    </div>

                    <div>

                        <h4 className="font-semibold">

                            Ankush

                        </h4>

                        <p className="text-sm text-slate-500">

                            Patient

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Navbar;