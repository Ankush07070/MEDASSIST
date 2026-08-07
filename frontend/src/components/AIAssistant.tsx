import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

function AIAssistant() {

    const [message, setMessage] = useState("");

    return (

        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">

            <div className="flex items-center gap-3">

                <div className="bg-white/20 p-3 rounded-2xl">

                    <Sparkles size={30}/>

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        MEDASSIST AI

                    </h2>

                    <p className="text-blue-100">

                        Your personal healthcare assistant

                    </p>

                </div>

            </div>

            <p className="mt-8 text-lg">

                👋 Hi! Ask me anything about your medical reports,
                medicines or appointments.

            </p>

            <div className="mt-8">

                <input
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="Ask your AI assistant..."
                    className="w-full rounded-xl p-4 text-slate-800 outline-none"
                />

                <button
                    className="mt-4 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition"
                >

                    <Send size={18}/>

                    Ask AI

                </button>

            </div>

            <div className="mt-8">

                <p className="font-semibold mb-4">

                    Suggested Questions

                </p>

                <div className="flex flex-wrap gap-3">

                    <button className="bg-white/20 px-4 py-2 rounded-full">

                        Explain my blood report

                    </button>

                    <button className="bg-white/20 px-4 py-2 rounded-full">

                        Find a cardiologist

                    </button>

                    <button className="bg-white/20 px-4 py-2 rounded-full">

                        Summarize my MRI

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AIAssistant;