import {
    LayoutDashboard,
    FileText,
    MessageCircle,
    CalendarDays,
    UserRound,
    Building2,
    LogOut,
} from "lucide-react";

import Logo from "./Logo";

function Sidebar() {

    return (

        <aside className="w-72 h-screen bg-white/70 backdrop-blur-xl border-r border-white shadow-xl flex flex-col">

            <div className="p-8">

                <Logo />

            </div>

            <nav className="flex-1 px-4">

                <SidebarItem icon={<LayoutDashboard size={20}/>} title="Dashboard"/>

                <SidebarItem icon={<FileText size={20}/>} title="Reports"/>

                <SidebarItem icon={<MessageCircle size={20}/>} title="AI Chat"/>

                <SidebarItem icon={<CalendarDays size={20}/>} title="Appointments"/>

                <SidebarItem icon={<UserRound size={20}/>} title="Doctors"/>

                <SidebarItem icon={<Building2 size={20}/>} title="Hospitals"/>

            </nav>

            <div className="p-5">

                <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-xl p-3 w-full transition">

                    <LogOut size={20}/>

                    Logout

                </button>

            </div>

        </aside>

    );

}

function SidebarItem({
    icon,
    title,
}:{
    icon:React.ReactNode;
    title:string;
}){

    return(

        <button className="flex items-center gap-4 w-full rounded-2xl p-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 mb-2">

            {icon}

            <span className="font-medium">

                {title}

            </span>

        </button>

    );

}

export default Sidebar;