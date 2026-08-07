function Logo() {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
                🩺
            </div>

            <div>
                <h1 className="font-bold text-xl text-slate-800">
                    MEDASSIST
                </h1>

                <p className="text-xs text-slate-500">
                    AI Healthcare
                </p>
            </div>
        </div>
    );
}

export default Logo;