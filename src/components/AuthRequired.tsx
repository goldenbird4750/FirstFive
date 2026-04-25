"use client";

import { useRouter } from "next/navigation";

export default function AuthRequired() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center px-4 py-10">

      {/* 🔥 Card */}
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-md shadow-lg">

        <h2 className="text-2xl font-semibold mb-3">
          Unlock Your Progress 🚀
        </h2>

        <p className="text-gray-400 mb-6">
          Login or create an account to save your skills,
          track progress, and continue your journey.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push("/signin")}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* 📌 Today Action Section */}
      <div className="w-full max-w-xl mt-10">

        <h3 className="text-xl font-semibold mb-4 text-center">
          Today’s Action
        </h3>

        {/* 🔒 Disabled Add Skill Button */}
        <button
          disabled
          className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg opacity-50 cursor-not-allowed"
        >
          + Add Skill (Login Required)
        </button>
      </div>
    </div>
  );
}