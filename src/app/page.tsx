"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ─── Types ───────────────────────────────────────────────
type View = "mcq" | "chat";

type Answers = {
  skill?: string[];
  currentLevel?: string[];
  biggestBlock?: string[];
  dailyTime?: string[];
  whyMatters?: string[];
};

type Message = {
  role: "user" | "ai";
  content: string;
  showSignupButton?: boolean;
  showBattleButton?: boolean;
};

type Question = {
  id: keyof Answers;
  question: string;
  subtext: string;
  options: string[];
};

// ─── MCQ Questions ────────────────────────────────────────
const questions: Question[] = [
  {
    id: "skill",
    question: "What skill do you want to master?",
    subtext: "Select all that apply",
    options: [
      "Public Speaking",
      "Coding & Development",
      "Writing & Content",
      "Fitness & Health",
      "A New Language",
      "Music & Instrument",
      "Business & Entrepreneurship",
      "Something Else",
    ],
  },
  {
    id: "currentLevel",
    question: "Where are you right now with this skill?",
    subtext: "Select all that apply",
    options: [
      "Complete beginner — never tried",
      "Tried a few times but stopped",
      "I know basics but feel stuck",
      "Intermediate but not progressing",
    ],
  },
  {
    id: "biggestBlock",
    question: "What stops you from starting every day?",
    subtext: "Select all that apply",
    options: [
      "I don't know where to begin",
      "I start but lose focus quickly",
      "I fear I'm not good enough",
      "Life gets busy — no time",
      "I get overwhelmed by how much there is",
      "I just feel lazy honestly",
    ],
  },
  {
    id: "dailyTime",
    question: "How much time can you realistically give daily?",
    subtext: "Select all that apply",
    options: [
      "Just 5 minutes",
      "15–30 minutes",
      "30–60 minutes",
      "1 hour or more",
    ],
  },
  {
    id: "whyMatters",
    question: "Why does this skill matter to you?",
    subtext: "Select all that apply",
    options: [
      "Career growth & better job",
      "Personal confidence",
      "Creative expression",
      "To help others",
      "Prove something to myself",
      "Financial freedom",
    ],
  },
];

// ─── Chat Chips ───────────────────────────────────────────
const CHAT_CHIPS = [
  "😴 Feeling tired and unmotivated",
  "😰 Feeling overwhelmed",
  "🤷 Don't know where to start",
  "😟 Fear of failing",
  "📵 Too many distractions",
  "⏰ No time to start",
];

// ─── localStorage helpers ─────────────────────────────────
const STORAGE_KEYS = {
  onboarded: "5minshift_onboarded",
  answers: "5minshift_answers",
  username: "5minshift_username",
  expiry: "5minshift_expiry",
};

function saveWithExpiry(key: string, value: string, hours: number) {
  const expiry = new Date().getTime() + hours * 60 * 60 * 1000;
  localStorage.setItem(key, value);
  localStorage.setItem(STORAGE_KEYS.expiry, String(expiry));
}

function isExpired(): boolean {
  const expiry = localStorage.getItem(STORAGE_KEYS.expiry);
  if (!expiry) return true;
  return new Date().getTime() > Number(expiry);
}

function clearOnboarding() {
  localStorage.removeItem(STORAGE_KEYS.onboarded);
  localStorage.removeItem(STORAGE_KEYS.answers);
  localStorage.removeItem(STORAGE_KEYS.expiry);
}

// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════
export default function HomePage() {
  const router = useRouter();

  // ─── Session ─────────────────────────────────────────────
  const { data: session, status } = useSession();

  // ─── View state ─────────────────────────────────────────
  const [view, setView] = useState<View | null>(null);

  // ─── MCQ state ──────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // ─── Chat state ─────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userSkill, setUserSkill] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ─── On mount — check session first ─────────────────────
  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // ── LOGGED IN USER ────────────────────────────────────
    if (status === "authenticated" && session?.user) {
      const name = session.user.name || "";
      localStorage.setItem(STORAGE_KEYS.username, name);
      setUserName(name);

      // Try to load skill from localStorage for greeting
      const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
      if (savedAnswers) {
        try {
          const parsed = JSON.parse(savedAnswers) as Answers;
          setUserSkill(
            Array.isArray(parsed.skill)
              ? parsed.skill.join(", ")
              : parsed.skill || ""
          );
        } catch {
          // ignore parse errors
        }
      }

      // Skip MCQ — go straight to chat
      setView("chat");
      return;
    }

    // ── GUEST USER ────────────────────────────────────────
    const onboarded = localStorage.getItem(STORAGE_KEYS.onboarded);
    const expired = isExpired();

    // Expired — clear and show MCQ again
    if (expired && onboarded) {
      clearOnboarding();
      setView("mcq");
      return;
    }

    // Load saved name and skill
    const savedName = localStorage.getItem(STORAGE_KEYS.username) || "";
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
    setUserName(savedName);

    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers) as Answers;
        setUserSkill(
          Array.isArray(parsed.skill)
            ? parsed.skill.join(", ")
            : parsed.skill || ""
        );
      } catch {
        // ignore parse errors
      }
    }

    if (!onboarded) {
      setView("mcq");
    } else {
      setView("chat");
    }
  }, [status, session]);

  // ─── Auto scroll ────────────────────────────────────────
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ─── Call AI ─────────────────────────────────────────────
  const callAI = async (
    payload:
      | { isOnboarding: true; onboardingAnswers: Answers }
      | { isOnboarding: false; messages: { role: string; content: string }[] }
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.message,
          showSignupButton: data.showSignupButton || false,
          showBattleButton: data.showBattleButton || false,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Something went wrong. But don't let that stop you — open your skill and do 5 minutes right now.",
          showBattleButton: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── MCQ Handlers ────────────────────────────────────────
  const handleToggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleNext = async () => {
    if (selectedOptions.length === 0) return;

    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: selectedOptions };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      saveWithExpiry(STORAGE_KEYS.answers, JSON.stringify(newAnswers), 24);
      saveWithExpiry(STORAGE_KEYS.onboarded, "true", 24);

      setView("chat");
      setUserSkill(newAnswers.skill?.join(", ") || "");

      await callAI({
        isOnboarding: true,
        onboardingAnswers: newAnswers,
      });
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOptions([]);
    }
  };

  // ─── Chat Handlers ────────────────────────────────────────
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");

    const history = newMessages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    }));

    await callAI({ isOnboarding: false, messages: history });
  };

  // ─── Loading state ───────────────────────────────────────
  if (view === null || status === "loading") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════
  // VIEW 1 — MCQ
  // ═══════════════════════════════════════════════════════
  if (view === "mcq") {
    const progressPercent =
      ((currentQuestion + 1) / questions.length) * 100;

    return (
      <main
        className="min-h-screen"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="max-w-2xl mx-auto px-8 py-20">

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-indigo-400 text-sm font-medium">
                Step {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-white/40 text-sm">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
              <div
                className="bg-indigo-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {questions[currentQuestion].question}
            </h2>
            <p className="text-white/40 text-sm">
              {questions[currentQuestion].subtext}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {questions[currentQuestion].options.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleToggleOption(option)}
                  className={`text-left p-4 rounded-2xl border transition-all text-sm font-medium flex items-center gap-3 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-white/30"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex items-center justify-between">
            <span className="text-white/30 text-xs">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} selected`
                : "Select at least one"}
            </span>
            <button
              onClick={handleNext}
              disabled={selectedOptions.length === 0}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl px-8 py-3 font-semibold text-sm transition-all"
            >
              {currentQuestion === questions.length - 1
                ? "See My Plan →"
                : "Next →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════
  // VIEW 2 — CHAT
  // ═══════════════════════════════════════════════════════
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto w-full">

          {/* Greeting */}
          {messages.length === 0 && (
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {userName
                  ? `Welcome back, ${userName} 👋`
                  : "Welcome back 👋"}
              </h1>
              <p className="text-white/50 text-sm">
                {userSkill
                  ? `Ready to push your ${userSkill} forward today?`
                  : "What's blocking you today?"}
              </p>

              {/* Show signup prompt if guest */}
              {status === "unauthenticated" && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <span className="text-white/40 text-xs">
                    Your progress is temporary
                  </span>
                  <Link
                    href="/signup"
                    className="text-indigo-400 text-xs font-semibold hover:text-indigo-300"
                  >
                    Save it →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white/5 border border-white/10 text-white/90 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Signup button */}
                {msg.role === "ai" && msg.showSignupButton && (
                  <div className="flex justify-start mt-3 ml-1">
                    <div className="space-y-2 w-full max-w-xs">
                      <Link
                        href="/signup"
                        className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
                      >
                        Create Account to Save Progress →
                      </Link>
                      <Link
                        href="/battle"
                        className="block text-center border border-white/20 text-white/50 hover:text-white/80 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all"
                      >
                        Skip for now
                      </Link>
                      <p className="text-white/20 text-xs text-center">
                        Your answers are saved for 24 hours
                      </p>
                    </div>
                  </div>
                )}

                {/* Battle button */}
                {msg.role === "ai" && msg.showBattleButton && (
                  <div className="flex justify-start mt-3 ml-1">
                    <Link
                      href="/battle"
                      className="block bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
                    >
                      Start Your 5 Min Session →
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        </div>
      </div>

      {/* Bottom input */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto w-full">

          {/* Chips */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {CHAT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="text-xs bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 text-white/60 hover:text-indigo-300 px-4 py-2 rounded-full transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 items-end">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              placeholder="What's blocking you today..."
              className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl px-5 py-3 text-white text-sm placeholder-white/30 outline-none resize-none transition-all"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-5 py-3 text-sm font-semibold transition-all"
            >
              Send
            </button>
          </div>

          <p className="text-white/20 text-xs text-center mt-3">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  );
}