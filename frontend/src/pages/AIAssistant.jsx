import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Eraser, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

const promptGroups = [
  {
    label: "Resume",
    prompts: [
      "How can I improve my resume for a frontend role?",
      "Rewrite my resume summary to sound more confident.",
    ],
  },
  {
    label: "Interview",
    prompts: [
      "Give me interview preparation tips for software jobs.",
      "Ask me 5 practice questions for a React developer role.",
    ],
  },
  {
    label: "Growth",
    prompts: [
      "What skills should I learn to become a product manager?",
      "How can I make my profile more attractive to recruiters?",
    ],
  },
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        await getProfile();
      } catch (err) {
        navigate("/login");
      }
    };

    init();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");

    const newMessage = { role: "user", content: query.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setQuery("");

    try {
      const response = await fetch("http://localhost:5000/api/ai/assistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to get AI response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      setError(err.message || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-slate-50 p-6 lg:p-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">AI Career Assistant</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Ask for resume tips, interview prep, career advice, and skill recommendations.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Try a starting point</h2>
              <span className="hidden text-xs font-medium text-slate-500 sm:inline">
                Pick one, then personalize it.
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {promptGroups.map((group) => {
                return (
                  <div
                    key={group.label}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 text-sm font-semibold text-slate-900">{group.label}</div>
                    <div className="space-y-2">
                      {group.prompts.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setQuery(item)}
                          className="w-full rounded-lg border border-transparent bg-slate-50 px-3 py-2.5 text-left text-sm leading-5 text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Conversation</h2>
                <p className="text-xs text-slate-500">AI responses are quick and concise.</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setError("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Eraser className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            <div className="min-h-[300px] space-y-4 overflow-visible rounded-xl bg-slate-50 p-4">
              {messages.length === 0 && !loading && (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <h3 className="text-base font-semibold text-slate-900">
                    Start with a real career question.
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    You can ask for resume improvements, a learning roadmap, job search advice, or a mock interview plan.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-full overflow-visible rounded-2xl px-4 py-3 shadow-sm sm:max-w-[88%] ${
                      message.role === "assistant"
                        ? "bg-white text-slate-800 ring-1 ring-slate-200"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${message.role === "assistant" ? "text-indigo-700" : "text-indigo-100"}`}>
                      {message.role === "assistant" ? "SkillMatch AI" : "You"}
                    </p>
                    <p className="mt-2 whitespace-pre-line break-words text-sm leading-6">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    <p className="text-xs font-semibold text-indigo-700">SkillMatch AI</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-300 [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                rows={2}
                className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                placeholder="Ask for resume, career, or interview advice..."
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                {loading ? "Thinking" : "Send"}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              Press Enter to send, Shift + Enter for a new line.
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
