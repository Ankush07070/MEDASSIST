import {
    Sparkles,
    Send,
    User,
    Bot,
    Loader2,
} from "lucide-react";
import { useState } from "react";

import { sendChatMessage } from "../api/chat";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

function AIAssistant() {

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<Message[]>([]);

    const [loading, setLoading] = useState(false);

    async function handleSendMessage() {

        const question = message.trim();

        if (!question || loading) {
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: question,
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
        ]);

        setMessage("");

        try {

            setLoading(true);

            const response =
                await sendChatMessage({
                    question,
                });

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content:
                    response.answer ||
                    "I could not find that information in your uploaded reports.",
            };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);

        } catch (error: any) {

            console.error(
                "AI chat failed:",
                error
            );

            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content:
                    error?.response?.data?.detail ||
                    "Unable to connect to MEDASSIST AI right now.",
            };

            setMessages((previous) => [
                ...previous,
                errorMessage,
            ]);

        } finally {

            setLoading(false);

        }

    }

    function handleKeyDown(
        e: React.KeyboardEvent<HTMLInputElement>
    ) {

        if (e.key === "Enter") {
            handleSendMessage();
        }

    }

    function handleSuggestedQuestion(
        question: string
    ) {

        setMessage(question);

    }

    return (

        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">

            {/* Header */}

            <div className="flex items-center gap-3">

                <div className="bg-white/20 p-3 rounded-2xl">

                    <Sparkles size={30} />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        MEDASSIST AI

                    </h2>

                    <p className="text-blue-100">

                        Your medical report assistant

                    </p>

                </div>

            </div>

            {/* Empty State */}

            {messages.length === 0 && (

                <div className="mt-8">

                    <p className="text-lg">

                        👋 Ask me about your uploaded medical reports.

                    </p>

                    <p className="text-blue-100 text-sm mt-2">

                        I'll answer using information retrieved from your reports.

                    </p>

                </div>

            )}

            {/* Messages */}

            {messages.length > 0 && (

                <div className="mt-8 space-y-4 max-h-[420px] overflow-y-auto pr-2">

                    {messages.map((item) => (

                        <div
                            key={item.id}
                            className={`flex gap-3 ${
                                item.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >

                            {item.role === "assistant" && (

                                <div className="flex-shrink-0 bg-white/20 p-2 rounded-xl">

                                    <Bot size={18} />

                                </div>

                            )}

                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    item.role === "user"
                                        ? "bg-white text-slate-800"
                                        : "bg-white/15 text-white"
                                }`}
                            >

                                <p className="whitespace-pre-wrap text-sm leading-6">

                                    {item.content}

                                </p>

                            </div>

                            {item.role === "user" && (

                                <div className="flex-shrink-0 bg-white/20 p-2 rounded-xl">

                                    <User size={18} />

                                </div>

                            )}

                        </div>

                    ))}

                    {loading && (

                        <div className="flex items-center gap-3">

                            <div className="bg-white/20 p-2 rounded-xl">

                                <Bot size={18} />

                            </div>

                            <div className="bg-white/15 rounded-2xl px-4 py-3">

                                <div className="flex items-center gap-2 text-sm">

                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                    MEDASSIST is analyzing your reports...

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            )}

            {/* Input */}

            <div className="mt-8">

                <div className="flex gap-3">

                    <input
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        placeholder="Ask about your medical reports..."
                        className="flex-1 rounded-xl p-4 text-slate-800 outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={
                            loading ||
                            !message.trim()
                        }
                        className="bg-white text-indigo-600 font-semibold px-5 rounded-xl flex items-center justify-center hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {loading ? (
                            <Loader2
                                size={20}
                                className="animate-spin"
                            />
                        ) : (
                            <Send size={20} />
                        )}

                    </button>

                </div>

                <p className="text-xs text-blue-100 mt-2">

                    Press Enter to send

                </p>

            </div>

            {/* Suggested Questions */}

            <div className="mt-8">

                <p className="font-semibold mb-4">

                    Suggested Questions

                </p>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={() =>
                            handleSuggestedQuestion(
                                "Explain my blood report"
                            )
                        }
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"
                    >

                        Explain my blood report

                    </button>

                    <button
                        onClick={() =>
                            handleSuggestedQuestion(
                                "Summarize my MRI"
                            )
                        }
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"
                    >

                        Summarize my MRI

                    </button>

                    <button
                        onClick={() =>
                            handleSuggestedQuestion(
                                "What are the important findings in my reports?"
                            )
                        }
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"
                    >

                        Important findings

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AIAssistant;