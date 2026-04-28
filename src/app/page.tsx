// app/page.tsx (or pages/index.tsx)

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white font-sans" style={{ backgroundColor: "#0f172a" }}>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-8 pt-28 pb-16 text-center">
        <div className="inline-block bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Stop waiting to feel motivated
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          You don't need motivation.
          <br />
          <span className="text-indigo-400">You need 5 minutes.</span>
        </h1>

        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Action resistance is killing your goals. Science shows that starting —
          even for just 5 minutes — rewires how you feel about the work.
          5MinShift makes that first step effortless.
        </p>
      </section>

      {/* PROBLEM */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why you keep{" "}
            <span className="text-red-400">not starting</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            It's not laziness. It's not a lack of discipline. It's action
            resistance — and it's happening to everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "😶",
              title: "You wait to feel ready",
              desc: "You tell yourself you'll start when you're in the mood. That moment rarely comes.",
            },
            {
              emoji: "📉",
              title: "Goals die in silence",
              desc: "Without daily micro-action, big goals feel abstract. Then they disappear.",
            },
            {
              emoji: "🔁",
              title: "Guilt creates more resistance",
              desc: "Missing a day makes it harder to start the next. The cycle compounds.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The fix is simpler than you think
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            5MinShift is built on one idea: just start. The feelings follow the
            action — never the other way around.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Set a goal",
              desc: "Pick something you've been putting off. Any goal, any size.",
              color: "text-indigo-400",
            },
            {
              step: "02",
              title: "Work for 5 minutes",
              desc: "That's the only commitment. 5 minutes. The timer runs. You show up.",
              color: "text-violet-400",
            },
            {
              step: "03",
              title: "Decide what's next",
              desc: "Add more time, do more work, or quit — guilt-free. You already won by starting.",
              color: "text-purple-400",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="text-5xl font-black text-white/5 absolute top-4 right-5 select-none">
                {item.step}
              </div>
              <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${item.color}`}>
                Step {item.step}
              </div>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

<div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4 font-semibold">
            Your consistency tracker
          </p>
          <div className="flex justify-center gap-2 flex-wrap max-w-md mx-auto mb-4">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-md ${
                  i < 22
                    ? i % 5 === 4
                      ? "bg-indigo-300"
                      : "bg-indigo-600"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="text-white/40 text-sm">
            Every session logged. Every streak visible. Every win counted.
    </p>
    </div>
      </section>

      {/* URGENCY */}
      <section className="max-w-3xl mx-auto px-8 py-16 text-center">
        <div className="bg-gradient-to-br from-indigo-900/60 to-violet-900/40 border border-indigo-500/30 rounded-3xl p-12">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-3xl font-bold mb-4">
            Every day you delay is a day your future self pays for.
          </h2>
          <p className="text-white/60 mb-3 leading-relaxed">
            You've already read this far. That means part of you is ready.
            The only thing between you and momentum is one 5-minute session.
          </p>
          <p className="text-indigo-300 font-semibold mb-8">
            Start now. Not tomorrow. Not after the weekend. Now.
          </p>
        </div>
      </section>

      {/* SIGNUP / LOGIN CARD — bottom of page */}
      <section className="max-w-md mx-auto px-8 pb-24 text-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-2">Ready to break the resistance?</h3>
          <p className="text-white/50 text-sm mb-6">
            Join thousands who stopped waiting and started doing — 5 minutes at a time.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signup"
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20"
            >
              Create Free Account
            </Link>
            <Link
              href="/signin"
              className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-sm transition-all"
            >
              I already have an account
            </Link>
          </div>
          <p className="text-white/20 text-xs mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 text-center py-8 text-white/30 text-sm px-8">
        <div>
          <span className="text-indigo-400 font-bold">5Min</span>Shift — Remove action resistance
        </div>
      </footer>

    </main>
  );
}