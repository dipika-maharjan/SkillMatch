import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    const newMessage = { role: "user", content: query.trim() };
    setMessages((prev) => [...prev, newMessage]);

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
      setQuery("");
    } catch (err) {
      setError(err.message || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#f7f7fb] p-6 lg:p-10">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                AI Career Assistant
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Ask for resume tips, career advice, interview prep, and skill
                recommendations.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>

          <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Try these prompts
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "How can I improve my resume for a frontend role?",
                "What skills should I learn to become a product manager?",
                "Give me interview preparation tips for software jobs.",
                "How can I make my profile more attractive to recruiters?",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Conversation
              </h2>
              <span className="text-sm text-slate-500">
                AI responses are quick and concise.
              </span>
            </div>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-3xl p-4 ${message.role === "assistant" ? "bg-indigo-50 text-slate-900" : "bg-slate-100 text-slate-800"}`}
                >
                  <p className="text-sm font-semibold capitalize">
                    {message.role}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:flex-row"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Ask for resume, career, or interview advice..."
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
