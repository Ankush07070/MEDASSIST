import { useEffect, useRef, useState } from "react";
import {
    Bot,
    Send,
    User,
    Sparkles,
    FileText,
    Loader2,
} from "lucide-react";

import {
    sendChatMessage,
    getChatHistory,
    type ChatHistoryItem,
} from "../../api/chat";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at?: string;
}

function AIAssistantPage() {

    const [messages, setMessages] = useState<Message[]>([]);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        async function loadHistory() {

            try {

                const history = await getChatHistory();

                const formatted: Message[] = [];

                history
                    .slice()
                    .reverse()
                    .forEach((chat: ChatHistoryItem) => {

                        formatted.push({
                            id: `${chat.id}-user`,
                            role: "user",
                            content: chat.question,
                            created_at: chat.created_at,
                        });

                        formatted.push({
                            id: `${chat.id}-assistant`,
                            role: "assistant",
                            content: chat.answer,
                            created_at: chat.created_at,
                        });

                    });

                setMessages(formatted);

            } catch (error) {

                console.error(
                    "Failed to load chat history:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }

        loadHistory();

    }, []);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, sending]);

    async function handleSend() {

        const question = message.trim();

        if (!question || sending) {
            return;
        }

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: question,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setMessage("");

        try {

            setSending(true);

            const response =
                await sendChatMessage({
                    question,
                });

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: response.answer,
            };

            setMessages((prev) => [
                ...prev,
                assistantMessage,
            ]);

        } catch (error) {

            console.error(
                "AI chat failed:",
                error
            );

            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content:
                    "Unable to get a response from MEDASSIST AI right now.",
            };

            setMessages((prev) => [
                ...prev,
                errorMessage,
            ]);

        } finally {

            setSending(false);

        }

    }

    function handleKeyDown(
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleSend();

        }

    }

    function useSuggestion(
        question: string
    ) {

        setMessage(question);

    }

    return (

        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="bg-indigo-100 p-3 rounded-2xl">

                        <Sparkles
                            size={26}
                            className="text-indigo-600"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">

                            MEDASSIST AI

                        </h1>

                        <p className="text-slate-500 mt-1">

                            Ask questions about your uploaded medical reports.

                        </p>

                    </div>

                </div>

            </div>

            {/* Chat Container */}

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

                {/* Chat Header */}

                <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-5 text-white">

                    <div className="flex items-center gap-3">

                        <div className="bg-white/20 p-3 rounded-2xl">

                            <Bot size={25} />

                        </div>

                        <div>

                            <h2 className="font-bold text-lg">

                                AI Medical Assistant

                            </h2>

                            <p className="text-blue-100 text-sm">

                                Powered by your medical report data

                            </p>

                        </div>

                    </div>

                </div>

                {/* Messages */}

                <div className="h-[520px] overflow-y-auto p-6 bg-slate-50">

                    {loading ? (

                        <div className="flex items-center justify-center h-full">

                            <div className="flex items-center gap-3 text-slate-500">

                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />

                                Loading conversation...

                            </div>

                        </div>

                    ) : messages.length === 0 ? (

                        <div className="flex flex-col items-center justify-center h-full text-center">

                            <div className="bg-indigo-100 p-5 rounded-3xl">

                                <Bot
                                    size={42}
                                    className="text-indigo-600"
                                />

                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mt-5">

                                Hello! I'm MEDASSIST AI

                            </h2>

                            <p className="text-slate-500 max-w-md mt-2">

                                Ask me questions about your uploaded
                                medical reports and I'll retrieve
                                relevant information for you.

                            </p>

                            <div className="flex flex-wrap justify-center gap-3 mt-6">

                                <button
                                    onClick={() =>
                                        useSuggestion(
                                            "Summarize my medical report"
                                        )
                                    }
                                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm hover:border-indigo-300 hover:text-indigo-600 transition"
                                >

                                    Summarize my report

                                </button>

                                <button
                                    onClick={() =>
                                        useSuggestion(
                                            "Explain my blood report"
                                        )
                                    }
                                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm hover:border-indigo-300 hover:text-indigo-600 transition"
                                >

                                    Explain my blood report

                                </button>

                                <button
                                    onClick={() =>
                                        useSuggestion(
                                            "What are the important findings in my report?"
                                        )
                                    }
                                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm hover:border-indigo-300 hover:text-indigo-600 transition"
                                >

                                    Important findings

                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="space-y-5">

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

                                        <div className="flex-shrink-0 bg-indigo-100 p-2.5 rounded-xl h-fit">

                                            <Bot
                                                size={19}
                                                className="text-indigo-600"
                                            />

                                        </div>

                                    )}

                                    <div
                                        className={`max-w-[80%] rounded-2xl px-5 py-4 whitespace-pre-wrap ${
                                            item.role === "user"
                                                ? "bg-blue-600 text-white rounded-br-md"
                                                : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                                        }`}
                                    >

                                        {item.content}

                                    </div>

                                    {item.role === "user" && (

                                        <div className="flex-shrink-0 bg-blue-100 p-2.5 rounded-xl h-fit">

                                            <User
                                                size={19}
                                                className="text-blue-600"
                                            />

                                        </div>

                                    )}

                                </div>

                            ))}

                            {sending && (

                                <div className="flex gap-3">

                                    <div className="bg-indigo-100 p-2.5 rounded-xl h-fit">

                                        <Bot
                                            size={19}
                                            className="text-indigo-600"
                                        />

                                    </div>

                                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-5 py-4">

                                        <div className="flex items-center gap-2 text-slate-500">

                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            MEDASSIST is thinking...

                                        </div>

                                    </div>

                                </div>

                            )}

                            <div ref={messagesEndRef} />

                        </div>

                    )}

                </div>

                {/* Input */}

                <div className="border-t border-slate-200 bg-white p-5">

                    <div className="flex gap-3">

                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask something about your medical reports..."
                            rows={2}
                            disabled={sending}
                            className="flex-1 resize-none border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
                        />

                        <button
                            onClick={handleSend}
                            disabled={
                                sending ||
                                !message.trim()
                            }
                            className="self-end bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            <Send size={20} />

                        </button>

                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">

                        <FileText size={14} />

                        <span>
                            MEDASSIST answers using your uploaded report context.
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AIAssistantPage;